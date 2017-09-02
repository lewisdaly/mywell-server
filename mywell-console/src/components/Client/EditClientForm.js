import React from 'react'
import { observer } from 'mobx-react'

const getBasicRow = (form, rowId) => {
  return (
    <div className="mt3">
      <label className="db fw4 lh-copy f6" htmlFor={form.$(rowId).id}>{form.$(rowId).label}</label>
      <input className="pa2 input-reset ba bg-transparent w-100" {...form.$(rowId).bind()} />
      <p>{form.$(rowId).error}</p>
    </div>
  );
}

export default observer(({ form }) => (

  <form className="ba b--transparent ph0 mh0" onSubmit={form.onSubmit}>

    {getBasicRow(form, 'id')}
    {getBasicRow(form, 'username')}
    {getBasicRow(form, 'mobileNumber')}
    {getBasicRow(form, 'email')}

    {getEditingButtons(form)}
    <p>{form.error}</p>
  </form>
));
