import React, { Component } from 'react';
import * as Constants from './assets/Constants';


import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';

import './App.css';
import './assets/animations.css';

const Loader = () => (
  <div className='loader' />
)

class SliderProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: this.props.token,
      categories: this.props.categories,
      products: false,
    }
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = () => {
    var category = '';
    var location = window.location.pathname.split('/').filter(x=>x).pop();
    if ( '/' !== window.location.pathname && '' !== window.location.pathname) {
      category = '?category=' + this.state.categories.find(
        cat => cat.slug === location
      ).id
    }
    fetch(Constants.apiUrl + 'wc/v3/products/' + category, {
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
    return(
      <div>
      {
        !this.state.isLoading && 
        <Slider
          autoplay={3000}
          //disabled={true}
          className='slider-wrapper'
        >
        {
            this.state.products.map( product => (
                <div
                  key={product.id}
                  className='slider-content'
                  style={{ background: `url('${product.images[0].src}') center left no-repeat` }}
                >
                    <div className="inner">
                      <h2>{product.name}</h2>
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
                      {
                        product.date_on_sale_to !== null &&
                        <p 	className="precio-vigencia">Vigencia:&nbsp;
                          {
                              new Date(product.date_on_sale_to).toLocaleString(
                                'es-ES',
                                { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                }
                            )
                          }
                        </p>
                      }
                    </div> 
                </div>
            ))
        }
        </Slider>
      }
      {
        this.state.isLoading && <Loader />
      }
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      token: false,
    }
  }

  componentDidMount() {
    var style = window.location.search.split('=').filter(x=>x).pop();
    this.setState({style});

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
    .then( this.fetchCategories )  
    .catch(error => console.log(error))
  }

  fetchCategories = () => {
    fetch(Constants.apiUrl + 'wc/v3/products/categories?per_page=20', {
      headers:{
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': 'Bearer ' + this.state.token
      },
    })
    .then(response => response.json())
    .then((categories) => this.setState({
        categories
    }))
    //.then( this.fetchProducts )
  }

  render() {
    return (
      <div className={`App animacion${this.state.style}`}>
      {
        this.state.categories &&
        <SliderProducts
          token={this.state.token}
          categories={this.state.categories}
          intlData = {this.state.intlData}
        />
      }
      {
        !this.state.categories && <Loader/>
      }
      </div>
    );
  }
}

export default App;
