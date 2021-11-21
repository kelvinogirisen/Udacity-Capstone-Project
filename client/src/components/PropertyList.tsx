import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Menu,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { deleteProperty, getProperties, patchProperty } from '../api/property-api'
import Auth from '../auth/Auth'
import { Property } from '../types/Property'

interface PropertysProps {
  auth: Auth
  history: History
}

interface PropertysState {
  propertyItem: Property[]
  newPropertyTitle: string
  newPropertyDescription: string
  newPropertyType: string
  newPropertyLocation: string
  loadingProperties: boolean
}

export class Propertys extends React.PureComponent<PropertysProps, PropertysState> {
  state: PropertysState = {
    propertyItem: [],
    newPropertyTitle: '',
    newPropertyDescription: '',
    newPropertyType: '',
    newPropertyLocation: '',
    loadingProperties: true
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPropertyTitle: event.target.value })
  }  

  onEditButtonClick = (propertyId: string) => {
    this.props.history.push(`/property/${propertyId}/edit`)
  }

  onPropertyCreate = () => {
    this.props.history.push(`/property/create`)
  }

  
  onPropertyDelete = async (propertyId: string) => {
    try {
      await deleteProperty(this.props.auth.getIdToken(), propertyId)
      this.setState({
        propertyItem: this.state.propertyItem.filter(property => property.propertyId !== propertyId)
      })
    } catch {
      alert('Property deletion failed!')
    }
  }

  onPropertyCheck = async (pos: number) => {
    try {
      const property = this.state.propertyItem[pos]
      await patchProperty(this.props.auth.getIdToken(), property.propertyId, {
        title: property.title,
        description: property.description,
        type: property.type,
        location: property.location,
        done: !property.done
      })
      this.setState({
        propertyItem: update(this.state.propertyItem, {
          [pos]: { done: { $set: !property.done } }
        })
      })
    } catch {
      alert('Property deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const propertyItem = await getProperties(this.props.auth.getIdToken())
      this.setState({
        propertyItem,
        loadingProperties: false
      })
    } catch (e:any) {
      alert(`Failed to fetch properties: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Property List</Header>

        {this.renderCreatePropertyInput()}

        {this.renderProperties()}
      </div>
    )
  }

  renderCreatePropertyInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'green',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Property',
              onClick: this.onPropertyCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Redefining the real estate business..."
            onChange={this.handleTitleChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderProperties() {
    if (this.state.loadingProperties) {
      return this.renderLoading()
    }

    return this.renderPropertyList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Property List
        </Loader>
      </Grid.Row>
    )
  }

  renderPropertyList() {
    return (
      <Grid padded>
        <Grid.Row>              
          <Grid.Column width={2}>
            <Menu fluid vertical>
              <Menu.Item className='header'>TITLE</Menu.Item>
            </Menu>
            
          </Grid.Column>
          <Grid.Column width={6} verticalAlign="middle">
            <Menu fluid vertical>
              <Menu.Item className='header'>DESCRIPTION</Menu.Item>
            </Menu>            
          </Grid.Column>
          <Grid.Column width={2} verticalAlign="middle">
            <Menu fluid vertical>
              <Menu.Item className='header'>TYPE</Menu.Item>
            </Menu>
          </Grid.Column>
          <Grid.Column width={2} verticalAlign="middle">
            <Menu fluid vertical>
              <Menu.Item className='header'>LOCATION</Menu.Item>
            </Menu>
          </Grid.Column>            
        </Grid.Row> 
             
        {this.state.propertyItem?.map((propertyItem, pos) => {
          return (
            <Grid.Row key={propertyItem.propertyId}>              
              <Grid.Column width={3} verticalAlign="middle">
                {propertyItem.title}
              </Grid.Column>
              <Grid.Column width={5} floated="right">
                {propertyItem.description}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {propertyItem.type}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {propertyItem.location}
              </Grid.Column>
              
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(propertyItem.propertyId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPropertyDelete(propertyItem.propertyId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {propertyItem.attachmentUrl && (
                <Image src={propertyItem.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateExpireDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
