// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import {
  createTag,
  getQueryIndex
} from '../../scripts/utilities.js';


index.js
import {$,jQuery} from 'jquery';
// export for others scripts to use
window.$ = $;
window.jQuery = jQuery;

export async function getProperties() {
  const indexUrl = '/index-all.json';
  const { columns: properties} = await getQueryIndex(indexUrl);
  return properties;
}

export function addForm() {
  var rules_basic = {
    condition: 'AND',
    rules: [{
      id: 'price',
      operator: 'less',
      value: 10.25
    }, {
      condition: 'OR',
      rules: [{
        id: 'category',
        operator: 'equal',
        value: 2
      }, {
        id: 'category',
        operator: 'equal',
        value: 1
      }]
    }]
  };
  
  $('#builder-basic').queryBuilder({
    plugins: ['bt-tooltip-errors'],
    
    filters: [{
      id: 'name',
      label: 'Name',
      type: 'string'
    }, {
      id: 'category',
      label: 'Category',
      type: 'integer',
      input: 'select',
      values: {
        1: 'Books',
        2: 'Movies',
        3: 'Music',
        4: 'Tools',
        5: 'Goodies',
        6: 'Clothes'
      },
      operators: ['equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null']
    }, {
      id: 'in_stock',
      label: 'In stock',
      type: 'integer',
      input: 'radio',
      values: {
        1: 'Yes',
        0: 'No'
      },
      operators: ['equal']
    }, {
      id: 'price',
      label: 'Price',
      type: 'double',
      validation: {
        min: 0,
        step: 0.01
      }
    }, {
      id: 'id',
      label: 'Identifier',
      type: 'string',
      placeholder: '____-____-____',
      operators: ['equal', 'not_equal'],
      validation: {
        format: /^.{4}-.{4}-.{4}$/
      }
    }],
  
    rules: rules_basic
  });
  
  $('#btn-reset').on('click', function() {
    $('#builder-basic').queryBuilder('reset');
  });
  
  $('#btn-set').on('click', function() {
    $('#builder-basic').queryBuilder('setRules', rules_basic);
  });
  
  $('#btn-get').on('click', function() {
    var result = $('#builder-basic').queryBuilder('getRules');
    
    if (!$.isEmptyObject(result)) {
      alert(JSON.stringify(result, null, 2));
    }
  });
}

async function buildDropdownOptions() {
  const propertyDropdown = document.querySelector('form#propertyCheck select#propertyName');
  const properties = await getProperties();
  console.log(properties);
  properties.forEach((prop) => {
    const option = createTag('option', { value: `${prop}` }, `${prop}`);
    propertyDropdown.append(option);
  });
}

function typeChange(e) {
  let hasDate = false;
  let hasTime = false;
  switch (e.target.value) {
    case 'date':
      hasDate = true;
      break;
    case 'time':
      hasTime = true;
      break;
    default:
      hasDate = true;
      hasTime = true;
      break;
  }
  document.querySelectorAll('form#picker input[type=date]').forEach((date) => {
    date.hidden = !hasDate;
    date.required = hasDate;
  });
  document.querySelectorAll('form#picker [name=time-picker]').forEach((time) => {
    time.hidden = !hasTime;
    time.required = hasTime;
  });
}

export function useButtonClicked(e, actions, doc = document) {
  e.preventDefault();

  const form = doc.querySelector('form#picker');
  if (!form.reportValidity()) {
    return;
  }

  const inputType = doc.querySelector('form#typeselect input[name="date-picker"]:checked').value;
  let seldate = '';
  if (inputType.includes('date')) {
    seldate = doc.querySelector('form#picker input[type=date]').value;
  }

  let seltime = '';
  let seltz = '';
  if (inputType.includes('time')) {
    seltime = doc.querySelector('form#picker input[type=time]').value;
    seltz = doc.querySelector('form#picker select#time-zone').value;
  } else {
    actions.sendText(seldate);
    actions.closeLibrary();
    return;
  }

  const d = new Date(`${seldate}T${seltime}${seltz}`);

  const result = d.toISOString();
  const cIdx = result.lastIndexOf(':');
  const result2 = result.substring(0, cIdx);
  const result3 = result2.replace('T', ' ');
  const result4 = `${result3}Z`;

  actions.sendText(result4);
  actions.closeLibrary();
}

function initControls(actions) {
  document.querySelectorAll('form#typeselect input[type=radio]').forEach((radio) => {
    radio.addEventListener('change', typeChange);
  });

  document.querySelectorAll('button#use').forEach((button) => {
    button.onclick = (e) => useButtonClicked(e, actions);
  });
}

(async function init() {
  console.log('init');
  //const { actions } = await DA_SDK;

  buildDropdownOptions();
  addForm();
  initControls(actions);
}());
