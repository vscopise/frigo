import React, { Component } from 'react';
import * as Constants from './assets/Constants';

import {Carousel} from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

import logo from './logo.svg';
import './App.css';

const Loader = () =>(
  <div className='loader' />
)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: false,
    }
  }
  componentDidMount() {
    this.fetchToken();
  }

  fetchToken = () => {
    fetch(Constants.apiUrl + 'jwt-auth/v1/token', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }), 
      body: JSON.stringify({
        username: Constants.username,
        password: Constants.password
      })
    })
    .then(res => res.json())
    .then(data => this.setState({
        token: data.token,
        isLoading: false,
    }))
    .then( this.fetchProducts )
    .catch(error => console.log(error))
  }

  fetchProducts = () => {
    fetch(Constants.apiUrl + 'wc/v3/products/', {
      headers:{
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': 'Bearer ' + this.state.token
      },
  })
  .then(response => response.json())
  .then((products) => this.setState({
      isLoading: false,
      products
  }))
  }

  render() {
    return (
      <div className="App">
      {
        this.state.products &&
        <Carousel
            showArrows={false}
            showStatus={false}
            showIndicators={false}
            showThumbs={false}
            autoPlay={true}
            infiniteLoop={true}
            interval={6000}
            transitionTime={1200}
            dynamicHeight={true}
        >
        {
            this.state.products.map( product => (
                <div key={product.id}>
                  <img src={product.images[0].src} alt={product.title} />
                    <div className="slide-content">
                      <p 	className="nombre">{product.title}</p>
                      <div 
                        className='extracto'
                        dangerouslySetInnerHTML={{__html: product.description}}
                      />
                      {
                        product.regular_price !== '' &&
                        <p 	className="precio-anterior">{product.regular_price}</p>
                      }
                      {
                        product.sale_price !== '' &&
                        <p 	className="precio-nuevo">{product.sale_price}</p>
                      }
                      <p 	className="precio_vigencia"> 30/03</p>
                    </div> 
                </div>
            ))
        }
        </Carousel>
      }
      {
        !this.state.products && <Loader/>
      }
      </div>
    );
  }
}

export default App;
