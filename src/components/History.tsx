import React from 'react';

type HistoryProps = {
  items: string[];
  onItemClick: (item: string) => void;
};

const History: React.FC<HistoryProps> = ({ items, onItemClick }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index} onClick={() => onItemClick(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
};

export default History; 