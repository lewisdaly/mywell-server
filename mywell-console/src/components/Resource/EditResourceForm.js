import React from 'react'
import { observer } from 'mobx-react'


export default observer(({ form }) => (
  <form onSubmit={form.onSubmit}>
    <label htmlFor={form.$('postcode').id}>
      {form.$('postcode').label}
    </label>
    <input {...form.$('postcode').bind()} />
    <p>{form.$('postcode').error}</p>

    <label htmlFor={form.$('resourceId').id}>
      {form.$('resourceId').label}
    </label>
    <input {...form.$('resourceId').bind()} />
    <p>{form.$('resourceId').error}</p>

    <label htmlFor={form.$('resourceType').id}>
      {form.$('resourceType').label}
    </label>
    <select onChange={event => form.update({'resourceType':event.target.value})}>
      {form.$('resourceType').extra.map(option => {
        return (
          <option key={option} value={option}>{option}</option>
        );
      })}
    </select>
    <p>{form.$('resourceType').error}</p>

    <label htmlFor={form.$('lat').id}>
      {form.$('lat').label}
    </label>
    <input {...form.$('lat').bind()} />
    <p>{form.$('lat').error}</p>

    <label htmlFor={form.$('lng').id}>
      {form.$('lng').label}
    </label>
    <input {...form.$('lng').bind()} />
    <p>{form.$('lng').error}</p>

    <label htmlFor={form.$('owner').id}>
      {form.$('owner').label}
    </label>
    <input {...form.$('owner').bind()} />
    <p>{form.$('owner').error}</p>


    <button type="submit" onClick={form.onSubmit}>Submit</button>
    <button type="button" onClick={form.onClear}>Clear</button>
    <button type="button" onClick={form.onReset}>Reset</button>

    <p>{form.error}</p>
  </form>
));
