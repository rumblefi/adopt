import React from 'react'
import pf from 'petfinder-client'
import Pet from '../Pet/Pet'
import SearchBox from '../SearchBox/SearchBox'
import {Consumer} from '../SearchContext/SearchContext'

const petfinder = pf({key: '210155b437437fb951ae192b7501ca3e', secret: 'ef14245e8eacd7be9b2aa9cffccb9a3f'})

class Results extends React.Component {

    state = {
        pets: []
    }

    componentDidMount() {
        this.search()
    }

    search = () => {
        petfinder
            .pet
            .find({output: "full", location: this.props.searchParams.location, animal: this.props.searchParams.animal, breed: this.props.searchParams.breed})
            .then(data => {
                let pets
                if (data.petfinder.pets && data.petfinder.pets.pet) {
                    if (Array.isArray(data.petfinder.pets.pet)) {
                        pets = data.petfinder.pets.pet
                    } else {
                        pets = [data.petfinder.pets.pet]
                    }
                } else {
                    pets = []
                }
                this.setState({pets})
            })
    }

    render() {
        return (
            <div className="search">
                    <SearchBox search={this.search} /> 
                    {this
                    .state
                    .pets
                    .map(pet => {
                        let breed;
                        if (Array.isArray(pet.breeds.breed)) {
                            breed = pet
                                .breeds
                                .breed
                                .join(", ");
                        } else {
                            breed = pet.breeds.breed;
                        }
                        return (<Pet
                            animal={pet.animal}
                            key={pet.id}
                            id={pet.id}
                            name={pet.name}
                            breed={breed}
                            media={pet.media}
                            location={`${pet.contact.city}, ${pet.contact.state}`}/>);
                    })}
            </div>
        );
    }

}

export default function ResultsWithContext(props) {
    return (
        <Consumer>
            {context => <Results {...props} searchParams={context}/>}
        </Consumer>
    )
}