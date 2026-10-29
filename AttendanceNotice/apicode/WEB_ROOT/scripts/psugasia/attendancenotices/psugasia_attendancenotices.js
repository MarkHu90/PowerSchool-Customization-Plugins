function jDialog(s) {
  jQuery('<div><p>'+s+'</p></div>').dialog({
    resizable: false,
    closeOnEscape: false,
    height: "auto",
    width: "auto",
    modal: true,
    buttons: {
      "OK": function() {
        jQuery( this ).dialog( "close" );
      }
    }
  });
}

function jConfirm(s) {
  var defer = jQuery.Deferred();
  jQuery('<div><p>'+s+'</p></div>').dialog({
    resizable: false,
    closeOnEscape: false,
    height: "auto",
    width: "auto",
    modal: true,
    buttons: {
      "Yes": function() {
        jQuery( this ).dialog( "close" );
        defer.resolve("true");
      },
      "No": function() {
        jQuery( this ).dialog( "close" );
        defer.resolve("false");
      }
    }
  });
  return defer.promise();
}

async function wait(milliseconds) {
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}