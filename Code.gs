/**
 * ------------------------------------------------------------------------
 * El-Koiby Coffee - Professional Google Apps Script Backend
 * ------------------------------------------------------------------------
 * 
 * كيفية التثبيت:
 * 1. انسخ هذا الكود بالكامل وضعه في محرر Apps Script الجديد (أو احفظ هذا الملف بامتداد .gs).
 * 2. اضغط على Deploy ثم New Deployment.
 * 3. اختر النوع: Web App.
 * 4. Execute as: Me (حسابك الشخصي).
 * 5. Who has access: Anyone.
 * 6. اضغط Deploy وانسخ رابط Web App URL والصقه في لوحة تحكم المتجر.
 */

// إعداد النظام تلقائياً وإنشاء الجداول والمجلد
function initializeSystem(storeName) {
  var props = PropertiesService.getScriptProperties();
  
  // 1. إنشاء مجلد الصور
  var folderName = storeName + " - ملفات المتجر";
  var folder = DriveApp.createFolder(folderName);
  var folderId = folder.getId();
  folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  // 2. إنشاء قاعدة البيانات (Spreadsheet)
  var dbName = storeName + " - قاعدة البيانات الأساسية";
  var ss = SpreadsheetApp.create(dbName);
  var dbId = ss.getId();
  
  // 3. نقل قاعدة البيانات إلى المجلد الجديد
  var file = DriveApp.getFileById(dbId);
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  
  // 4. إنشاء وتنسيق الجداول
  setupSheets(ss);
  
  // 5. حفظ المعرفات في إعدادات السكريبت
  props.setProperty("DB_ID", dbId);
  props.setProperty("FOLDER_ID", folderId);
  
  return {
    success: true,
    message: "تم تأسيس قواعد البيانات والمجلدات بنجاح.",
    dbId: dbId,
    folderId: folderId
  };
}

function setupSheets(ss) {
  // Products Sheet
  var productsSheet = ss.getActiveSheet();
  productsSheet.setName("Products");
  productsSheet.appendRow(["id", "name", "category", "price", "stock", "image", "description", "lastUpdated"]);
  productsSheet.getRange("A1:H1").setFontWeight("bold").setBackground("#1E3932").setFontColor("white");
  
  // Orders Sheet
  var ordersSheet = ss.insertSheet("Orders");
  ordersSheet.appendRow(["id", "date", "items", "total", "type", "customerName", "customerPhone", "customerAddress", "status"]);
  ordersSheet.getRange("A1:I1").setFontWeight("bold").setBackground("#1E3932").setFontColor("white");
  
  // Settings Sheet
  var settingsSheet = ss.insertSheet("Settings");
  settingsSheet.appendRow(["key", "value"]);
  settingsSheet.getRange("A1:B1").setFontWeight("bold").setBackground("#1E3932").setFontColor("white");
}

function doPost(e) {
  // CORS Headers
  var headers = {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json"
  };
  
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({error: "No payload received."})).setMimeType(ContentService.MimeType.JSON);
    }
    
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var result;
    
    // التوجيه (Routing)
    switch(action) {
      case "init":
        result = initializeSystem(data.storeName || "El-Koiby Coffee");
        break;
      case "sync_products":
        result = syncData("Products", data.payload);
        break;
      case "sync_orders":
        result = syncData("Orders", data.payload);
        break;
      default:
        result = { error: "Unknown action" };
    }
    
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // لجلب البيانات (Products, Orders) إذا كانت موجودة
  var action = e.parameter.action;
  if(!action) {
     return ContentService.createTextOutput(JSON.stringify({ status: "API is running. Please use POST for actions."})).setMimeType(ContentService.MimeType.JSON);
  }
  
  var props = PropertiesService.getScriptProperties();
  var dbId = props.getProperty("DB_ID");
  
  if(!dbId) {
    return ContentService.createTextOutput(JSON.stringify({ error: "System not initialized."})).setMimeType(ContentService.MimeType.JSON);
  }
  
  var ss = SpreadsheetApp.openById(dbId);
  var result = {};
  
  if(action === "export") {
    result.products = getSheetData(ss, "Products");
    result.orders = getSheetData(ss, "Orders");
    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheetData(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if(!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if(data.length <= 1) return [];
  
  var headers = data[0];
  var rows = [];
  for(var i = 1; i < data.length; i++) {
    var obj = {};
    for(var j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    rows.push(obj);
  }
  return rows;
}

function syncData(sheetName, payload) {
  var props = PropertiesService.getScriptProperties();
  var dbId = props.getProperty("DB_ID");
  if(!dbId) return { error: "DB ID not found. Initialize first." };
  
  var ss = SpreadsheetApp.openById(dbId);
  var sheet = ss.getSheetByName(sheetName);
  if(!sheet) return { error: "Sheet not found: " + sheetName };
  
  // لتبسيط التزامن الشامل، نقوم بمسح البيانات القديمة ووضع الجديدة
  // في الأنظمة الحقيقية يفضل استخدام الـ ID للتحديث ولكن بما أننا نملك State في React
  // سنقوم بتصدير الحالة كاملة
  if(payload && payload.length > 0) {
    // حفظ الـ Headers
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // مسح البيانات ماعدا العنوان
    if(sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
    }
    
    // ترتيب الأعمدة والتجهيز
    var newRows = [];
    for(var i = 0; i < payload.length; i++) {
      var item = payload[i];
      var rowArray = [];
      for(var j = 0; j < headers.length; j++) {
        var h = headers[j];
        var val = item[h] !== undefined ? item[h] : "";
        if(typeof val === 'object') val = JSON.stringify(val);
        rowArray.push(val);
      }
      newRows.push(rowArray);
    }
    
    if(newRows.length > 0) {
      sheet.getRange(2, 1, newRows.length, headers.length).setValues(newRows);
    }
  }
  
  return { success: true, syncedCount: payload ? payload.length : 0 };
}
