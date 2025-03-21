// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';
import {
  createTag,
  getQueryIndex
} from '../../scripts/utilities.js';

export async function getProperties() {
  const indexUrl = '/index-all.json';
  const { columns: properties} = await getQueryIndex(indexUrl);
  return properties;
}

export function addForm() { 
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
    }]
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

export function useButtonClicked(e, actions, doc = document) {
  e.preventDefault();

  const result = d.toISOString();
  const cIdx = result.lastIndexOf(':');
  const result2 = result.substring(0, cIdx);
  const result3 = result2.replace('T', ' ');
  const result4 = `${result3}Z`;

  actions.sendText(result4);
  actions.closeLibrary();
}

function initControls() {
  $('#btn-reset').on('click', function(e) {
    e.preventDefault();
    $('#builder-basic').queryBuilder('reset');
  });

  $('#btn-get').on('click', function(e) {
    e.preventDefault();
    var result = $('#builder-basic').queryBuilder('getRules');
    console.log(result);
    
    if (!$.isEmptyObject(result)) {
      alert(JSON.stringify(result, null, 2));
    }
  });
}

(async function init() {
  console.log('init');
  //const { actions } = await DA_SDK;
  
  buildDropdownOptions();
  addForm();
  //initControls(actions);
}());
