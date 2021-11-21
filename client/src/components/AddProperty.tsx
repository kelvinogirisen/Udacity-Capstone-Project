import * as React from 'react'
import dateFormat from 'dateformat'
import { History } from 'history'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { createPropertyId, getUploadUrl, uploadFile } from '../api/property-api'

enum UploadState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile,
}

interface CreatePropertyProps {  
  auth: Auth
  history: History
}

interface CreatePropertyState {
  title: string 
  description: string
  type: string
  location: string 
  file: any
  uploadState: UploadState
}

export class CreateProperty extends React.PureComponent<
  CreatePropertyProps,
  CreatePropertyState
> {
  state: CreatePropertyState = {
    title: '',
    description: '',
    type: '',
    location: '',
    file: undefined,
    uploadState: UploadState.NoUpload
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ description: event.target.value })
  }

  handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ type: event.target.value })
  }

  handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ location: event.target.value })
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  onCancelButtonClick = () => {
    this.props.history.push(`/`)
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.file) {
        alert('File should be selected')
        return
      }

      this.setUploadState(UploadState.FetchingPresignedUrl)

      const expireDate = this.calculateExpireDate()
      const newProperty = await createPropertyId(this.props.auth.getIdToken(), {
        title: this.state.title,
        description: this.state.description,
        type: this.state.type,
        location: this.state.location,
        expireDate
      })

      console.log('Created Property', newProperty)
      const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), newProperty.propertyId)

      this.setUploadState(UploadState.UploadingFile)
      await uploadFile(uploadUrl, this.state.file)

      alert('Property was created successfully!')
    } catch (e:any) {
      alert('Could not property: ' + e.message)
    } finally {
      this.setUploadState(UploadState.NoUpload)
    }
  }

  setUploadState(uploadState: UploadState) {
    this.setState({
      uploadState
    })
  }

  render() {
    return (
        <div>
        <h1>Add new Property</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Title</label>
            <input required
              placeholder="property title"
              value={this.state.title}
              onChange={this.handleTitleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input required
              placeholder="property description"
              value={this.state.description}
              onChange={this.handleDescriptionChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Type</label>
            <input required
              placeholder="property type"
              value={this.state.type}
              onChange={this.handleTypeChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Location</label>
            <input required
              placeholder="property location"
              value={this.state.location}
              onChange={this.handleLocationChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Property Image</label>
            <input required
              type="file"
              accept="image/*"
              placeholder="Property Image"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UploadState.NoUpload}
          type="submit" color="green"
        >
          Add Property
        </Button>
        <Button
          onClick={this.onCancelButtonClick} size="small" color="red"
        >
          Cancel
        </Button>
      </div>
    )
  }

  calculateExpireDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
