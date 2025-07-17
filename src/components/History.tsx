import React from 'react';

type HistoryProps = {
  items: string[];
  activeItem: string;
  onItemClick: (item: string) => void;
};

const History: React.FC<HistoryProps> = ({ items, activeItem, onItemClick }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li
          key={index}
          className={item === activeItem ? 'active' : ''}
          onClick={() => onItemClick(item)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
};

export default History; 