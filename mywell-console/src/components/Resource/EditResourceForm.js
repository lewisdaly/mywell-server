import React from 'react'
import { observer } from 'mobx-react'

// TODO: changing values in here doesn't work for some reason
import BasicFormRow from './BasicFormRow'


const getBasicRow = (form, rowId) => {

  return (
    <div className="mt3">
      <label className="db fw4 lh-copy f6" htmlFor={form.$(rowId).id}>{form.$(rowId).label}</label>
      <input className="pa2 input-reset ba bg-transparent w-100" {...form.$(rowId).bind()} />
      <p>{form.$(rowId).error}</p>
    </div>
  );
}


const getEditingButtons = (form) => {
  if (form.$('disabled').disabled) {
    return null;
  }

  return (
    <div className="pt3">
      <button
        className="mv1 w-100 b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib"
        type="submit"
        onClick={form.onSubmit}
      >
        Submit
      </button>
      <button
        className="mv1 w-100 b ph3 pv2 input-reset ba b--black bg-transparent pointer f6 dib"
        type="button"
        onClick={form.onReset}
        >
          Reset
        </button>
    </div>
  );
}

export default observer(({ form }) => (

  <form className="ba b--transparent ph0 mh0" onSubmit={form.onSubmit}>

    {getBasicRow(form, 'postcode')}
    {getBasicRow(form, 'resourceId')}

    <label className="db fw4 lh-copy f6" htmlFor={form.$('resourceType').id}>{form.$('resourceType').label}</label>
    <select
      className="fw4 lh-copy f6 pa2 ba w-100"
      onChange={event => form.update({'resourceType':event.target.value})}
      disabled={form.$('resourceType').disabled}
      >
      {form.$('resourceType').extra.map(option => {
        return (
          <option
            className="pa2"
            key={option}
            value={option}>{option}</option>
        );
      })}
    </select>
    <p>{form.$('resourceType').error}</p>

    {getBasicRow(form, 'lat')}
    {getBasicRow(form, 'lng')}
    {getBasicRow(form, 'owner')}

    {getEditingButtons(form)}

    <p>{form.error}</p>
  </form>
));
