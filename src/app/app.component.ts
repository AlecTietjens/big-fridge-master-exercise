declare var require: any;
import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'big-fridge-master';

  allItemsSource: LocalDataSource = new LocalDataSource();
  bucketItemsSource: LocalDataSource = new LocalDataSource();
  quantityOfExpiredPurchasedFood = 0;

  allItemsSettings = {
    actions: {
      add: false,
      delete: false,
      edit: false
    },
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      type: {
        title: 'Type',
        type: 'string',
      },
      store: {
        title: 'Store',
        type: 'string',
      },
      purchaseDate: {
        title: 'Purchase Date',
        type: 'string',
      },
      expirationDate: {
        title: 'Expiration Date',
        type: 'string',
      },
      quantity: {
        title: 'Quantity',
        type: 'number',
      }
    },
  };

  bucketSettings = {
    actions: {
      add: false,
      delete: false,
      edit: false
    },
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      type: {
        title: 'Type',
        type: 'string',
      },
      purchaseDate: {
        title: 'Purchase Date',
        type: 'string',
      },
      quantity: {
        title: 'Quantity',
        type: 'number',
      }
    },
  };

  constructor() {
    // Aggregate all items
    let allItems = [];
    for (let i = 0; i < 10; i++) {
      allItems = allItems.concat(require(`../../data/data-${i}.json`));
    }
    this.allItemsSource.load(allItems);

    // Reduce items purchased by date
    const bucketItemsAssociative = [];
    allItems.forEach(i => {
      const item = Object.assign({}, i);
      const date = item.purchaseDate.split('T')[0];
      if (bucketItemsAssociative[item.name + date]) {
        bucketItemsAssociative[item.name + date].quantity += item.quantity;
      } else {
        bucketItemsAssociative[item.name + date] = item;
        bucketItemsAssociative[item.name + date].purchaseDate = date;
      }
    });
    const bucketItems = [];
    for (const key in bucketItemsAssociative) {
      if (bucketItemsAssociative[key]) {
        bucketItems.push(bucketItemsAssociative[key]);
      }
    }
    this.bucketItemsSource.load(bucketItems);

    // Reduce for quantity of expired food
    allItems.forEach(i => {
      if (i.expirationDate < i.purchaseDate) {
        this.quantityOfExpiredPurchasedFood++;
      }
    });
  }
}
