import React, { useState, useEffect } from 'react';
import './App.css';

interface MenuItem {
  name: string;
  price: number;
}

interface Order {
  name: string;
  price: number;
  quantity?: number;
}

interface Customer {
  flatNumber: string;
  orders: Order[];
  date?: Date | string;
  deliveryTime?: string; // Existing field
  reviewComments?: string; // Existing field
  orderTime?: string; // New field for order time
}

const menuItems: MenuItem[] = [
  { name: 'Chicken donne Biryani', price: 159 },
  { name: 'Kushka / Biriyani Rice (Chicken)', price: 89 },
  { name: 'Phulka', price: 13 },
  { name: 'Butter Phulka', price: 18 },
  { name: 'Chicken Ghee Roast (Dry)', price: 199 },
  { name: 'Chicken Chilli (Dry)', price: 169 },
  { name: 'Chicken Curry', price: 159 },
  { name: 'Anda Tikka Masala (2 Eggs)', price: 89 },
  { name: 'Anda Tikka Masala (4 Eggs)', price: 119 },
  { name: 'Afghani Egg Curry (2 Eggs)', price: 89 },
  { name: 'Afghani Egg Curry (4 Eggs)', price: 119 },
  { name: 'Egg Masala (2 Eggs)', price: 89 },
  { name: 'Egg Masala (4 Eggs)', price: 119 },
  { name: 'Egg Bhurji Gravy (2 Eggs)', price: 89 },
  { name: 'Egg Bhurji Gravy (4 Eggs)', price: 119 },
  { name: 'Boiled Egg', price: 10 },
  { name: 'Paneer Chilli (Dry)', price: 169 },
  { name: 'Palak Paneer', price: 169 },
  { name: 'Shahi Paneer', price: 169 },
];

const STORAGE_KEY = 'food-order-customers';

const App = () => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const savedCustomers = localStorage.getItem(STORAGE_KEY);
    return savedCustomers ? JSON.parse(savedCustomers) : [];
  });

  const [flatNumber, setFlatNumber] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const handleAddCustomer = () => {
    if (!flatNumber.trim()) return;
    const newCustomer = {
      flatNumber,
      orders: [],
      date: new Date().toISOString(),
      deliveryTime: '',
      reviewComments: '',
      orderTime: '' // Initialize orderTime
    };
    setCustomers([...customers, newCustomer]);
    setFlatNumber('');
  };

  const handleDeleteCustomer = (customerIndex: number) => {
    setCustomers(customers.filter((_, index) => index !== customerIndex));
  };

  const handleAddOrder = (customerIndex: number) => {
    const newOrder = { name: '', price: 0, quantity: 1 };
    setCustomers(customers.map((customer, index) =>
      index === customerIndex ? { ...customer, orders: [...customer.orders, newOrder] } : customer
    ));
  };

  const handleSelectMenuItem = (customerIndex: number, orderIndex: number, menuItem: MenuItem) => {
    setCustomers(customers.map((customer, index) =>
      index === customerIndex ? {
        ...customer,
        orders: customer.orders.map((order, i) =>
          i === orderIndex ? { ...menuItem, quantity: order.quantity || 1 } : order
        )
      } : customer
    ));
  };

  const handleDeleteOrder = (customerIndex: number, orderIndex: number) => {
    setCustomers(customers.map((customer, index) =>
      index === customerIndex ? {
        ...customer,
        orders: customer.orders.filter((_, i) => i !== orderIndex)
      } : customer
    ));
  };

  const handleQuantityChange = (customerIndex: number, orderIndex: number, quantity: number) => {
    if (quantity < 1) return;
    setCustomers(customers.map((customer, index) =>
      index === customerIndex ? {
        ...customer,
        orders: customer.orders.map((order, i) =>
          i === orderIndex ? { ...order, quantity } : order
        )
      } : customer
    ));
  };

  const calculateTotal = (customer: Customer) => {
    return customer.orders.reduce((acc, order) => acc + order.price * (order.quantity || 1), 0);
  };

  // Handle delivery time and review comments updates
  const handleDeliveryTimeChange = (index: number, time: string) => {
    setCustomers(customers.map((customer, i) =>
      i === index ? { ...customer, deliveryTime: time } : customer
    ));
  };

  const handleReviewCommentsChange = (index: number, comments: string) => {
    setCustomers(customers.map((customer, i) =>
      i === index ? { ...customer, reviewComments: comments } : customer
    ));
  };

  // New handler for order time
  const handleOrderTimeChange = (index: number, time: string) => {
    setCustomers(customers.map((customer, i) =>
      i === index ? { ...customer, orderTime: time } : customer
    ));
  };

  return (
    <div className="container">
      <div className="left-panel">
        <input type="text" value={flatNumber} onChange={(e) => setFlatNumber(e.target.value)} placeholder="Flat Number" />
        <button onClick={handleAddCustomer}>Add Customer</button>
      </div>
      <div className="right-panel">
        {customers.slice().reverse().map((customer, i) => {
          const index = customers?.length - 1 - i;
          return (
            <div key={index} className="customer-card">
              <div className="customer-header">
                <h2>Flat Number: {customer.flatNumber}</h2>
                <p>Date: {typeof customer.date === 'string' ? new Date(customer.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null}</p>
                <button onClick={() => handleDeleteCustomer(index)} className="delete-flat-btn"> Delete Flat </button>
              </div>
              <div className='timeandcomments'>
                <div className='field'>
                  <label>
                    Order Time
                  </label>
                  <input
                    type="time"
                    value={customer.orderTime}
                    onChange={(e) => handleOrderTimeChange(index, e.target.value)}
                    placeholder="Order Time"
                  />
                </div><div className='field'>
                  <label>
                    Delivery Time
                  </label>
                  <input
                    type="time"
                    value={customer.deliveryTime}
                    onChange={(e) => handleDeliveryTimeChange(index, e.target.value)}
                    placeholder="Delivery Time"
                  />
                </div>
                <textarea
                  value={customer.reviewComments}
                  onChange={(e) => handleReviewCommentsChange(index, e.target.value)}
                  placeholder="Review Comments"
                />
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Menu Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((order, orderIndex) => (
                    <tr key={orderIndex}>
                      <td>
                        <select value={order.name} onChange={(e) => {
                          const selectedMenuItem = menuItems.find(menuItem => menuItem.name === e.target.value);
                          if (selectedMenuItem) {
                            handleSelectMenuItem(index, orderIndex, selectedMenuItem);
                          }
                        }}>
                          <option value="">Select Menu Item</option>
                          {menuItems.map(menuItem => (
                            <option key={menuItem.name} value={menuItem.name}>{menuItem.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input type="number" min="1" value={order.quantity || 1} onChange={(e) =>
                          handleQuantityChange(index, orderIndex, parseInt(e.target.value) || 1)
                        } />
                      </td>
                      <td>₹{order.price}</td>
                      <td>₹{order.price * (order.quantity || 1)}</td>
                      <td><button onClick={() => handleDeleteOrder(index, orderIndex)} className="delete-btn"> Delete </button></td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan={3}>Total:</td>
                    <td colSpan={2}>₹{calculateTotal(customer)}</td>
                  </tr>
                </tbody>
              </table>
              <button onClick={() => handleAddOrder(index)}>Add Item</button>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default App;