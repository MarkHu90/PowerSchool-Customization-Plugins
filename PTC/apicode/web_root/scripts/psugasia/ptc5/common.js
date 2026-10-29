async function getPQ(name, pageSize, body, fields, singleRecord, sortOrder = []) {
  let returnArray = (singleRecord ? {} : []);
  let pq;
  if (body) {
    pq = await fetch('/ws/schema/query/'+name+'?pagesize='+pageSize, {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  } else {
    pq = await fetch('/ws/schema/query/'+name+'?pagesize='+pageSize, {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  const response = await pq.json();
  if (response?.record !== undefined && response.record.length > 0) {
    if (singleRecord) {
      fields.forEach(function(field) {
        returnArray[field] = (typeof response.record[0][field] !== 'undefined' ? response.record[0][field] : '');
      });
    } else {
      response.record.forEach(function(record) {
        let obj = {};
        fields.forEach(function(field) {
          obj[field] = (typeof record[field] !== 'undefined' ? record[field] : '');
        });
        returnArray.push(obj);
      });

      if (sortOrder.length > 0) {
        sortOrder.forEach(function(so) {
          let sortField = so[0];
          let sortDirection = so[1];
          let sortMethod = so[2];
          if (sortMethod == 'numeric') {
            if (sortDirection == 'asc')
              returnArray.sort((a, b) => a[sortField] - b[sortField]);
            else if (sortDirection == 'desc')
              returnArray.sort((a, b) => b[sortField] - a[sortField]);
          }
          else if (sortMethod == 'alpha') {
            if (sortDirection == 'asc')
              returnArray.sort((a, b) => String(a[sortField]).localeCompare(String(b[sortField])));
            else if (sortDirection == 'desc')
              returnArray.sort((a, b) => String(b[sortField]).localeCompare(String(a[sortField])));
          }
        });
      }
    }
  }
  return returnArray;
}

async function getPSJSON(path, body, fields, singleRecord, sortOrder = []) {
  let returnArray = (singleRecord ? {} : []);
  let pq;
  if (body) {
    pq = await fetch(path+'?'+ new URLSearchParams(body).toString(), {
      cache: "no-cache",
      method: "GET"
    });
  } else {
    pq = await fetch(path, {
      cache: "no-cache",
      method: "GET"
    });
  }
  let response = await pq.json();
  if (response) {
    if (singleRecord) {
      fields.forEach(function(field) {
        if (Array.isArray(response))
          returnArray[field] = (typeof response[0][field] !== 'undefined' ? response[0][field] : '');
        else
          returnArray[field] = (typeof response[field] !== 'undefined' ? response[field] : '');
      });
    } else {
      if (response.length > 1)
        response.pop();
      response.forEach(function(record) {
        let obj = {};
        fields.forEach(function(field) {
          obj[field] = (typeof record[field] !== 'undefined' ? record[field] : '');
        });
        returnArray.push(obj);
      });

      if (sortOrder.length > 0) {
        sortOrder.forEach(function(so) {
          let sortField = so[0];
          let sortDirection = so[1];
          let sortMethod = so[2];
          if (sortMethod == 'numeric') {
            if (sortDirection == 'asc')
              returnArray.sort((a, b) => a[sortField] - b[sortField]);
            else if (sortDirection == 'desc')
              returnArray.sort((a, b) => b[sortField] - a[sortField]);
          }
          else if (sortMethod == 'alpha') {
            if (sortDirection == 'asc')
              returnArray.sort((a, b) => String(a[sortField]).localeCompare(String(b[sortField])));
            else if (sortDirection == 'desc')
              returnArray.sort((a, b) => String(b[sortField]).localeCompare(String(a[sortField])));
          }
        });
      }
    }
  }
  return returnArray;
}

async function getPHP(path, body, fields, singleRecord, sortOrder = []) {
  let returnArray = (singleRecord ? {} : []);
  let php;
  let response;
  try {
    if (body) {
      php = await fetch(path, {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
    } else {
      php = await fetch(path, {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    
    response = await php.json();
  } catch (e) {
    return (singleRecord ? {"error":"1"} : [{"error":"1"}]);
  }
  //const response = await php.json();
  if (response) {
    if (singleRecord) {
      fields.forEach(function(field) {
        if (Array.isArray(response))
          returnArray[field] = (typeof response[0][field] !== 'undefined' ? response[0][field] : '');
        else
          returnArray[field] = (typeof response[field] !== 'undefined' ? response[field] : '');
      });
    } else {
      response.forEach(function(record) {
        let obj = {};
        fields.forEach(function(field) {
          obj[field] = (typeof record[field] !== 'undefined' ? record[field] : '');
        });
        returnArray.push(obj);
      });

      if (sortOrder.length > 0) {
        sortOrder.forEach(function(so) {
          let sortField = so[0];
          let sortDirection = so[1];
          let sortMethod = so[2];
          if (sortMethod == 'numeric') {
            if (sortDirection == 'asc')
              returnArray.sort((a, b) => a[sortField] - b[sortField]);
            else if (sortDirection == 'desc')
              returnArray.sort((a, b) => b[sortField] - a[sortField]);
          }
          else if (sortMethod == 'alpha') {
            if (sortDirection == 'asc')
              returnArray.sort((a, b) => String(a[sortField]).localeCompare(String(b[sortField])));
            else if (sortDirection == 'desc')
              returnArray.sort((a, b) => String(b[sortField]).localeCompare(String(a[sortField])));
          }
        });
      }
    }
  }
  return returnArray;
}

function toggleCheckboxes(parentID) {
  let toggleState = (typeof $j('#'+parentID).data('toggleCheckboxState') === 'undefined' ? false : $j('#'+parentID).data('toggleCheckboxState'));
  $j('#'+parentID+' input[type="checkbox"]').each(function(k,v) {
    $j(v).prop('checked', !toggleState);
  });
  $j('#'+parentID).data('toggleCheckboxState', !toggleState);
}

function isMissingInput() {
  let missing = false;
  $j('.requiredInputMissing').removeClass('requiredInputMissing');
  $j('span.requiredInput').each(function(k,v) {
    $j(v).closest('div').find(':input').not('button').each(function(k2,v2) {
      if (
        !$j(v2).hasClass('chosen-search-input') //exclude chosen filter boxes
        && $j(v2).val() == ''
      ) {
        $j(v2).addClass('requiredInputMissing');
        missing = true;
      }
    });
  });
  return missing;
}

function loadExplanationToolTips() {
  $j('.explanation').attr('title','');
  $j('.explanation').tooltip({
    content: function() {
      return $j('#explanation_'+$j(this).data('contentid')).html();
    }
  });
}

function convertToDateTimeLocalString(date) {
  //convert JS date object to YYYY-mm-ddTHH:MM string for datetime-local inputs
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return year+'-'+month+'-'+day+'T'+hours+':'+minutes;
}

function ptcDDMONString(date) {
  //convert JS date object to dd mon string
  return new Intl.DateTimeFormat("en-GB", {month: "short", day: '2-digit'}).format(date);
}

function overlappingDateTimes(start1, end1, start2, end2) {
  if ((start1.getTime() <= end2.getTime()) && (end1.getTime() >= start2.getTime()))
    return true;
  else
    return false;
}

function date1BeforeDate2(date1, date2) {
  if (date1.getTime() < date2.getTime())
    return true;
  else
    return false;
}