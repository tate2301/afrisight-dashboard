import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../utils/apiUrl';
import GeneralLayout from '../../layout/GeneralLayout';
import { useApiFetcher } from '../../hooks/useApiFetcher';

interface StoreItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

const StorePage: React.FC = () => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axiosInstance = useApiFetcher();

  useEffect(() => {
    fetchStoreItems();
  }, []);

  const fetchStoreItems = async () => {
    try {
      const response = await axiosInstance.get(`${apiUrl}/v2/gamification/store`);
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch store items');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <GeneralLayout>
      <h1>Store Items</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.price}</td>
              <td>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </GeneralLayout>
  );
};

export default StorePage;
