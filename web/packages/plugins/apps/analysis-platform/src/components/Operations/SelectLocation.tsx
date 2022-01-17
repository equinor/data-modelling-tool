import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, SingleSelect, TextField } from '@equinor/eds-core-react'
import { TLocation } from '../../Types'
import useSearch from '../../hooks/useSearch'
import { Heading } from '../Design/Fonts'
import { Blueprints } from '../../Enums'

const LocationButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  max-width: 300px;
`

const SelectLocationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 400px;
`

const SelectLocation = (props: {
  location: TLocation
  locations: TLocation[]
  setLocation: Function
}): JSX.Element => {
  const { location, locations, setLocation } = props

  return (
    <div style={{ maxWidth: '400px', paddingTop: '10px' }}>
      <SingleSelect
        id="operationLocationSelector"
        label="Select location"
        value={
          location
            ? `${location.name} - ${location.lat.toFixed(
                7
              )},  ${location.long.toFixed(7)}`
            : ''
        }
        items={locations?.map((loc: TLocation) => {
          return `${loc.name} - ${loc.lat},  ${loc.long}`
        })}
        handleSelectedItemChange={(event: any) => {
          // Parse formatted location string to identify actual location. Show error in console if selectedItem is invalid
          if (event.selectedItem) {
            const [locationName] = event.selectedItem.split(' - ')
            setLocation(
              locations.find((loc: TLocation) => loc.name === locationName)
            )
          }
        }}
      />
    </div>
  )
}

const SelectOperationLocation = (props: {
  location: TLocation | undefined
  setLocation: Function
  setIsNewLocation: Function
  setError: Function
  mapClickPos: [number, number] | undefined
}): JSX.Element => {
  const [selectLocationType, setSelectLocationType] = useState<string>('select')
  const [locations, setLocations] = useState<TLocation[]>([])
  const [searchResult] = useSearch(Blueprints.LOCATION)

  /**
   * Set locations when the search has completed
   */
  useEffect(() => {
    if (searchResult) {
      setLocations(searchResult)
      setLocation(searchResult.length && searchResult[0])
    }
  }, [searchResult])
  const {
    location,
    setLocation,
    setIsNewLocation,
    mapClickPos,
    setError,
  } = props

  useEffect(() => {
    if (mapClickPos !== undefined) {
      setLocation({
        ...location,
        lat: mapClickPos[0],
        long: mapClickPos[1],
      })
    }
  }, [mapClickPos])
  return (
    <SelectLocationWrapper>
      <Heading text="Location" variant="h4" />
      <LocationButtonsGrid>
        <Button
          variant={selectLocationType === 'select' ? 'contained' : 'outlined'}
          onClick={() => {
            setSelectLocationType('select')
            setLocation(locations[0])
            setIsNewLocation(false)
          }}
        >
          Select existing
        </Button>
        <Button
          variant={selectLocationType === 'add' ? 'contained' : 'outlined'}
          onClick={() => {
            setSelectLocationType('add')
            setIsNewLocation(true)
            setLocation({
              lat: location?.lat || 0,
              long: location?.long || 0,
              name: '',
            })
          }}
        >
          New
        </Button>
      </LocationButtonsGrid>

      {selectLocationType === 'select' ? (
        <SelectLocation
          setLocation={setLocation}
          location={location}
          locations={locations}
        />
      ) : (
        <div style={{ paddingTop: '15px' }}>
          <TextField
            id="operationLocationName"
            placeholder="Location name"
            label="Location name"
            onChange={(event: any) => {
              if (!event.target.value) {
                setError('Location name cannot be empty.')
              } else {
                setError('')
              }
              setLocation({ ...location, name: event.target.value })
            }}
          />
          <TextField
            id="lat-input"
            label="Latitude"
            type="number"
            onChange={(event: any) =>
              setLocation({ ...location, lat: event.target.value })
            }
            value={location?.lat || ''}
          />
          <TextField
            id="long-input"
            label="Longitude"
            type="number"
            onChange={(event: any) => {
              setLocation({
                ...location,
                long: parseFloat(event.target.value),
              })
            }}
            value={location?.long || ''}
          />
          <div style={{ width: '100%  ', marginTop: '10px' }}>
            (You can also click on the map to change location)
          </div>
        </div>
      )}
    </SelectLocationWrapper>
  )
}

export default SelectOperationLocation
