import React from 'react'
import pf from 'petfinder-client'
import {navigate} from "@reach/router"
import Carousel from '../Carousel/Carousel';
import Modal from '../Modal/Modal'

const petfinder = pf({key: '210155b437437fb951ae192b7501ca3e', secret: 'ef14245e8eacd7be9b2aa9cffccb9a3f'})

export default class Details extends React.Component {

    state = {
        loading: true,
        showModal: false
    }

    toggleModal = () => this.setState({showModal: !this.state.showModal})

    componentDidMount() {
        petfinder
            .pet
            .get({output: "full", id: this.props.id})
            .then(data => {
                const pet = data.petfinder.pet
                let breed
                if (Array.isArray(pet.breeds.breed)) {
                    breed = pet
                        .breeds
                        .breed
                        .join(', ')
                } else {
                    breed = pet.breeds.breed
                }
                this.setState({
                    name: pet.name,
                    animal: pet.name,
                    location: `${pet.contact.city}, ${pet.contact.state}`,
                    description: pet.description,
                    media: pet.media,
                    breed,
                    loading: false
                })
            })
            .catch(() => navigate('/'))
    }

    render() {

        if (this.state.loading) {
            return <h1>loading...</h1>
        }

        const {
            name,
            animal,
            breed,
            location,
            description,
            media,
            showModal
        } = this.state

        return (
            <div className="details">
                <Carousel media={media}/>
                <div>
                    <h1>{name}</h1>
                    <h2>{animal}
                        - {breed}
                        - {location}</h2>
                    <button onClick={this.toggleModal}>Adop {name}</button>    
                    <p>{description}</p>

                    {
                        showModal ? (
                            <Modal>
                                <h1>Would you like to adopt {name} ?</h1>
                                <div className="buttons" >
                                    <button onClick={this.toggleModal}>Yes</button>
                                    <button onClick={this.toggleModal}>Hell Yes</button>
                                </div>
                            </Modal>
                        ) : null
                    }

                </div>
            </div>
        )

    }

}