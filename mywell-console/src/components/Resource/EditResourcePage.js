import React, { Component } from 'react'
import { gql, graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import { throttle } from 'throttle-debounce'
import validatorjs from 'validatorjs';
import MobxReactForm from 'mobx-react-form';
const plugins = { dvr: validatorjs };
// import {Form, Field} from 'simple-react-form'

// import 'simple-react-form-material-ui'

import { Loading } from '../common'

// import EditResourceForm from './EditResourceForm'


class EditResourcePage extends Component {

  constructor(props) {
    super(props);

    //TODO: copy resource props into state... maybe in props update
    this.state = {
      editing: false,
      name: 'Lewis'
    };
  }

  handleEditOrSavePressed() {
    const { editing } = this.state;

    this.setState({
      editing: !editing
    });
  }



  getForm() {
    const fields = {
      email: {
        label: 'Email',
        placeholder: 'Insert Email',
        rules: 'required|email|string|between:5,25',
      },
      password: {
        label: 'Password',
        placeholder: 'Insert Password',
        rules: 'required|string|between:5,25',
      },
    };

    const hooks = {
      onSuccess(form) {
        alert('Form is valid! Send the request here.');
        // get field values
        console.log('Form Values!', form.values());
      },
      onError(form) {
        alert('Form has errors!');
        // get all form errors
        console.log('All form errors', form.errors());
      }
    };

    const form = new MobxReactForm({ fields }, { plugins, hooks });

    return (
      <form onSubmit={form.onSubmit}>
        <label htmlFor={form.$('username').id}>
          {form.$('username').label}
        </label>
        <input {...form.$('username').bind()} />
        <p>{form.$('username').error}</p>

        {/* ... other inputs ... */}

        <button type="submit" onClick={form.onSubmit}>Submit</button>
        <button type="button" onClick={form.onClear}>Clear</button>
        <button type="button" onClick={form.onReset}>Reset</button>

        <p>{form.error}</p>
      </form>
    );
  }

  getFormOld() {
    const { resource } = this.props.data;
    const { editing } = this.state;
    console.log("hey");

    if (!resource) {
      return null;
    }

    return (
      <form className="pa4 black-80">
        <dl className="fl fn-l w-50 dib-l w-auto-l lh-title mr5-l">
          <dd className="f6 fw4 ml0">Pincode</dd>
          <dd className="f3 fw6 ml0">{resource.postcode}</dd>
        </dl>
        <dl className="fl fn-l w-50 dib-l w-auto-l lh-title mr5-l">
          <dd className="f6 fw4 ml0">ResourceId</dd>
          <dd className="f3 fw6 ml0">{resource.resourceId}</dd>
        </dl>
        <div className="cf">
          <div className="pv2 fl w-25">
            <label for="name" className="pa2 tc f6 b db">Latitude:</label>
          </div>
          <div className="pv2 fl w-75 bg-black-025 pa2">
            <input
              value={resource.lat}
              id="name"
              className="pa2 input-reset ba b--black-20 db w-100"
              type="text"
              aria-describedby="name-desc"
              disabled={!editing}
            />
            <small id="name-desc" className="f6 black-60 db"></small>
          </div>
          <div className="pv2 fl w-25">
            <label for="name" className="pa2 tc f6 b db">Longitude:</label>
          </div>
          <div className="pv2 fl w-75 bg-black-025 pa2">
            <input value={resource.lng} id="name" className="pa2 input-reset ba b--black-20 db w-100" type="text" aria-describedby="name-desc"/>
            <small id="name-desc" className="f6 black-60 db"></small>
          </div>
          <div className="pv2 fl w-35">
            <label for="name" className="pa2 tc f6 b db">Resource Type:</label>
          </div>
          <div className="pv2 fl w-65 bg-black-025 pa2">
            <select value={this.state.value} onChange={this.handleChange}>
              <option value="grapefruit">Well</option>
              <option value="lime">Raingauge</option>
              <option value="coconut">Checkdam</option>
            </select>
          </div>
        </div>

      </form>
    )
  }

  getButtons() {
    const { editing } = this.state;

    return (
      <div>
        <button
          className="f6 w-100 link dim br1 ba ph3 pv2 mb2 dib mid-gray"
          onClick={() => this.handleEditOrSavePressed()}
        >
          { editing ? 'Save' : 'Edit' }
        </button>
        <button
          className="f6 w-100 link dim br1 ba ph3 pv2 mb2 dib"
        >
          Delete
        </button>
      </div>
    );
  }

  render() {
    if (this.props.data.loading) {
      return <Loading/>
    }

    return (
      <div className="f6 w-100 mw6 center">
        {this.getForm()}
        {this.getButtons()}
      </div>
    );
  }
}

const ResourceQuery = gql`
  query resource($postcode: Int!, $resourceId: Int!){
      resource(postcode: $postcode, resourceId: $resourceId) {
        id
        resourceId
        lat
        lng
        lastValue
        wellDepth
        lastDate
        owner
        elevation
        type
        postcode
        clientId
      }
  }
`

const EditResourcePageWithResourceQuery = graphql(ResourceQuery, {
  options: ({match}) => ({
    variables: {
      postcode: match.params.postcode,
      resourceId: match.params.resourceId,
    },
  }),
})(EditResourcePage)

export default EditResourcePageWithResourceQuery;
