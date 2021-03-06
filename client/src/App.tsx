import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Input, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { CreateProperty } from './components/AddProperty'
import { EditProperty } from './components/EditProperty'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Propertys } from './components/PropertyList'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '2em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu pointing secondary>
        <Menu.Item name="home">
          <Link to="/" style={{ fontWeight: 'bolder', fontSize: '17px' }}>Home</Link>
        </Menu.Item>      

        <Menu.Menu position="right">
        <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>
          {this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout} style={{ fontWeight: 'bolder', fontSize: '17px' }}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin} style={{ fontWeight: 'bolder', fontSize: '17px' }}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Propertys {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/property/create"
          exact
          render={props => {
            return <CreateProperty {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/property/:propertyId/edit"
          exact
          render={props => {
            return <EditProperty {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
