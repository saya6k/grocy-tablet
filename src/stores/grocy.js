import { defineStore } from 'pinia'
import moment from 'moment'

export const useGrocyStore = defineStore('grocy', {
  state: () => ({
    _product_groups: [],
    _products: [],
    _stocks: [],
    _locations: []
  }),
  getters: {
    product_groups: (state) => {
      var groups =  state._product_groups.map((product_group) => {
        return {
          name: product_group.name,
          id: product_group.id,
          count: state._products.filter((product) => product.product_group_id === product_group.id)
            .length
        }
      })
      groups.push(
        {
          name: 'Sem grupos',
          id: null,
          count: state._products.filter((product) => product.product_group_id === null)
            .length
        }
      )
      return groups
    },
    products: (state) => {
      return state._products.map((product) => {
        var stock = state._stocks
          ? state._stocks.filter((stock) => stock.product_id === product.id)
          : []
        return {
          name: product.name,
          id: product.id,
          product_group_id: product.product_group_id,
          stock: stock,
          quantity: stock.reduce((acc, cur) => acc + cur.amount, 0),
          expire: stock.reduce((acc, cur) => {
            const exp = moment(cur.best_before_date, 'YYYY-MM-DD')
            return acc > exp || acc == null ? exp : acc
          }, null),
          picture_file_name: product.picture_file_name
        }
      })
    },
    locations: (state) => {
      return state._locations.map((location) => {
        var stock = state._stocks
          ? state._stocks.filter((stock) => stock.location_id === location.id)
          : []
        return {
          name: location.name,
          id: location.id,
          stock: stock,
          count: stock
            .map((stock) => stock.product_id)
            .filter((value, index, array) => array.indexOf(value) === index).length
        }
      })
    }
  },
  actions: {
    fetch() {
      this.fetchProductGroups()
      this.fetchProcuts()
      this.fetchStocks()
      this.fetchLocations()
    },
    fetchProductGroups() {
      fetch(
        'http://192.168.15.2:9283/api/objects/product_groups?GROCY-API-KEY=VHJVX7l8W0d4jv9PsQl3BqryjvF6f4KccbiLLYVlGbYrFpQ5wk'
      )
        .then((response) => response.json())
        .then((data) => {
          this._product_groups = data
        })
    },
    fetchProcuts() {
      fetch(
        'http://192.168.15.2:9283/api/objects/products?GROCY-API-KEY=VHJVX7l8W0d4jv9PsQl3BqryjvF6f4KccbiLLYVlGbYrFpQ5wk'
      )
        .then((response) => response.json())
        .then((data) => {
          this._products = data
        })
    },
    fetchStocks() {
      fetch(
        'http://192.168.15.2:9283/api/objects/stock?GROCY-API-KEY=VHJVX7l8W0d4jv9PsQl3BqryjvF6f4KccbiLLYVlGbYrFpQ5wk'
      )
        .then((response) => response.json())
        .then((data) => {
          this._stocks = data
        })
    },
    fetchLocations() {
      fetch(
        'http://192.168.15.2:9283/api/objects/locations?GROCY-API-KEY=VHJVX7l8W0d4jv9PsQl3BqryjvF6f4KccbiLLYVlGbYrFpQ5wk'
      )
        .then((response) => response.json())
        .then((data) => {
          this._locations = data
        })
    }
  }
})
