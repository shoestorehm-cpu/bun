/**
 * تعليمات الاستخدام (Google Apps Script):
 * 1. قم بإنشاء ملف Google Sheet جديد.
 * 2. اذهب إلى الإضافات (Extensions) -> برمجة تطبيقات جوجل (Apps Script).
 * 3. امسح الكود الموجود والصق هذا الكود بالكامل.
 * 4. قم بنشر التطبيق: Deploy -> New Deployment -> Web App.
 * 5. اختر التنفيذ كـ: Me (أنا).
 * 6. الوصول: Anyone (أي شخص).
 * 7. انسخ الرابط (URL) الذي ستحصل عليه.
 * هذا الرابط يمكنك استخدامه كواجهة خلفية للمتجر الخاص بك!
 * 
 * ملاحظة: النظام الحالي يعتمد على التخزين المحلي (LocalStorage) كبديل ليكون النظام أسرع ويخدمك مجانًا 100%،
 * ولكن يمكن استخدام هذا الكود في حال أردت ربط الطلبات بشيت جوجل.
 */

var SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ['Products', 'Orders', 'Users', 'Settings'];
  
  sheets.forEach(function(sheetName) {
    if (!ss.getSheetByName(sheetName)) {
      ss.insertSheet(sheetName);
    }
  });
  
  // Headers
  ss.getSheetByName('Products').getRange('A1:F1').setValues([['ID', 'Name', 'Category', 'Price', 'Stock', 'Description']]);
  ss.getSheetByName('Orders').getRange('A1:G1').setValues([['ID', 'Date', 'Items JSON', 'Total', 'Type', 'Customer Details JSON', 'Status']]);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    
    if (action === 'ADD_ORDER') {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
      var order = data.order;
      sheet.appendRow([
        order.id, 
        order.date, 
        JSON.stringify(order.items), 
        order.total, 
        order.type, 
        JSON.stringify({name: order.customerName, phone: order.customerPhone, address: order.customerAddress}), 
        order.status
      ]);
      
      // Sending email report if settings exist
      sendReportEmail(order);
      
      return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.message})).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendReportEmail(order) {
  var email = "admin@example.com"; // Replace with your email or read from Settings sheet
  var subject = "طلب جديد - " + order.id;
  var body = "تم استلام طلب جديد بقيمة: " + order.total + " جنيه.\n\nنوع الطلب: " + order.type;
  MailApp.sendEmail(email, subject, body);
}

function doGet(e) {
  return ContentService.createTextOutput("Google Apps Script is running correctly for El-Koiby Coffee.").setMimeType(ContentService.MimeType.TEXT);
}
