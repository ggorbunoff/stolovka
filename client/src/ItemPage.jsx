import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header'; 

const ItemPage = ({ items, addToCart }) => {
  const { id } = useParams();
  const item = items.find(i => i.id === parseInt(id));
  const [visibleItems, setVisibleItems] = useState(4);

  useEffect(() => {
    window.scrollTo(0, 0);
    setVisibleItems(4); 
  }, [id]);

  if (!item) {
    return <div>Item not found</div>;
  }

  const otherItems = items.filter(i => i.id !== item.id);
  
  const loadMore = () => {
    setVisibleItems(prevVisible => Math.min(prevVisible + 4, otherItems.length));
  };

  return (
    <div className="item-page">
      <Header />
      
      <div className='main-content'>
        <div className='item-page-section'>
          <div className="item-details">
            <img className="item-image" src={item.img} alt={`Image of ${item.name}`} />
            <div className="item-info">
              <div className='item-key'>
                <h2 className="item-name-big">{item.name}</h2>
                <p className="item-description">{item.description}</p>
              </div>
              <div className='item-content-big'>
                <p className="price">{item.price}</p>
                <button className="btn-def" onClick={() => addToCart(item)}>Добавить в корзину</button>
              </div>
            </div>
          </div>
          <div className='recoms'>
            <h3 className="other-items-title">Другие вкусности</h3>
      
            <ul className='item-layout'>
                {otherItems.slice(0, visibleItems).map(otherItem => (
                    <li className='item' key={otherItem.id}>
                        <div className='item-picture-small-container'>
                          <Link to={`/item/${otherItem.id}`}>
                            <img className='item-picture-small' src={otherItem.img} alt={`Image of ${otherItem.name}`} />
                          </Link>
                        </div>
                        <div className='item-content'>
                          <p className='item-name'>
                            <Link to={`/item/${otherItem.id}`}>
                              {otherItem.name}
                            </Link>
                          </p>
                          <p className='price'> {otherItem.price}</p>
                        </div>
                        <button className='btn-def' onClick={() => addToCart(otherItem)}>В заказ</button>
                    </li>
                ))}
            </ul>
            {visibleItems < otherItems.length && (
              <button className="load-more" onClick={loadMore}>Показать еще</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;