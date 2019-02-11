import React from "react";
import Results from '../Results/Results'
import '../../css/main.css'
import {Router, Link} from "@reach/router"
import Details from '../Details/Details'
import SearchParams from '../SearchParams/SearchParams'
import pf from 'petfinder-client'
import {Provider} from '../SearchContext/SearchContext'

const petfinder = pf({key: '210155b437437fb951ae192b7501ca3e', secret: 'ef14245e8eacd7be9b2aa9cffccb9a3f'})

export default class App extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            location: "Seattle, WA",
            animal: '',
            breed: '',
            breeds: [],
            handleLocationChange: this.handleLocationChange,
            handleAnimalChange: this.handleAnimalChange,
            handleBreedChange: this.handleBreedChange,
            getBreeds: this.getBreeds
        }

    }

    handleLocationChange = (event) => {
        this.setState({location: event.target.value})
    }

    handleAnimalChange = (event) => {
        this.setState({
            animal: event.target.value,
            breed: ""
        }, this.getBreeds)
    }

    getBreeds() {
        if (this.state.animal) {
            petfinder
                .breed
                .list({animal: this.state.animal})
                .then(data => {
                    if (data.petfinder && data.petfinder.breeds && Array.isArray(data.petfinder.breeds.breed)) {
                        this.setState({breeds: data.petfinder.breeds.breed})
                    } else {
                        this.setState({breeds: []})
                    }
                })
        } else {
            this.setState({breeds: []})
        }
    }

    handleBreedChange = event => {
        this.setState({breed: event.target.value})
    }

    render() {
        return (
            <div>
                <header>
                    <Link to="/">Adopt me!</Link>
                    <Link to="/search-params">Search</Link>
                </header>
                <Provider value={this.state} >
                    <Router>
                        <Results path="/"/>
                        <Details path="/details/:id"/>
                        <SearchParams path="/search-params"/>
                    </Router>
                </Provider>
            </div>
        )
    }

}