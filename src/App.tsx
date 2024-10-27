import { useState, useEffect } from 'react';
import './App.css';

interface MenuItem {
  name: string;
  price: number;
  quantity?: number;
}

interface Customer {
  flatNumber: string;
  orders: MenuItem[];
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
    setCustomers([...customers, { flatNumber, orders: [] }]);
    setFlatNumber('');
  };

  const handleDeleteCustomer = (customerIndex: number) => {
    setCustomers(customers.filter((_, index) => index !== customerIndex));
  };

  const handleAddOrder = (customerIndex: number) => {
    const newOrder: MenuItem = { name: '', price: 0, quantity: 1 };
    setCustomers(
      customers.map((customer, index) => {
        if (index === customerIndex) {
          return { ...customer, orders: [...customer.orders, newOrder] };
        }
        return customer;
      })
    );
  };

  const handleSelectMenuItem = (
    customerIndex: number,
    orderIndex: number,
    menuItem: MenuItem
  ) => {
    setCustomers(
      customers.map((customer, index) => {
        if (index === customerIndex) {
          return {
            ...customer,
            orders: customer.orders.map((order, i) => {
              if (i === orderIndex) {
                return { ...menuItem, quantity: order.quantity || 1 };
              }
              return order;
            }),
          };
        }
        return customer;
      })
    );
  };

  const handleDeleteOrder = (customerIndex: number, orderIndex: number) => {
    setCustomers(
      customers.map((customer, index) => {
        if (index === customerIndex) {
          return {
            ...customer,
            orders: customer.orders.filter((_, i) => i !== orderIndex),
          };
        }
        return customer;
      })
    );
  };

  const handleQuantityChange = (
    customerIndex: number,
    orderIndex: number,
    quantity: number
  ) => {
    if (quantity < 1) return;
    setCustomers(
      customers.map((customer, index) => {
        if (index === customerIndex) {
          return {
            ...customer,
            orders: customer.orders.map((order, i) => {
              if (i === orderIndex) {
                return { ...order, quantity };
              }
              return order;
            }),
          };
        }
        return customer;
      })
    );
  };

  const calculateTotal = (customer: Customer) => {
    return customer.orders.reduce(
      (acc, order) => acc + order.price * (order.quantity || 1),
      0
    );
  };

  return (
    <div className="container">
      <div className="left-panel">
        <input
          type="text"
          value={flatNumber}
          onChange={(e) => setFlatNumber(e.target.value)}
          placeholder="Flat Number"
        />
        <button onClick={handleAddCustomer}>Add Customer</button>
      </div>

      <div className="right-panel">
        {customers.map((customer, index) => (
          <div key={index} className="customer-card">
            <div className="customer-header">
              <h2>Flat Number: {customer.flatNumber}</h2>
              <button
                onClick={() => handleDeleteCustomer(index)}
                className="delete-flat-btn"
              >
                Delete Flat
              </button>
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
                      <select
                        value={order.name}
                        onChange={(e) => {
                          const selectedMenuItem = menuItems.find(
                            (menuItem) => menuItem.name === e.target.value
                          );
                          if (selectedMenuItem) {
                            handleSelectMenuItem(
                              index,
                              orderIndex,
                              selectedMenuItem
                            );
                          }
                        }}
                      >
                        <option value="">Select Menu Item</option>
                        {menuItems.map((menuItem) => (
                          <option key={menuItem.name} value={menuItem.name}>
                            {menuItem.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={order.quantity || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            index,
                            orderIndex,
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                    </td>
                    <td>₹{order.price}</td>
                    <td>₹{order.price * (order.quantity || 1)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteOrder(index, orderIndex)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
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
        ))}
      </div>
    </div>
  );
};

export default App;
