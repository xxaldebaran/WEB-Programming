import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../../shared/components/UIElements/Avatar';
import Card from '../../shared/components/UIElements/Card';
import './UserItem.css';

const UserItem = props => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        {/*create a link to the user's certificates page */}
        <Link to={`/${props.id}/certificates`}>
          <div className="user-item__image">
            {/*render the user's avatar */}
            <Avatar image={`http://localhost:5000/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            {/*display the user's name */}
            <h2>{props.name}</h2>
            {/*display the number of certificates the user has */}
            <h3>
              {props.certificateCount} {props.certificateCount === 1 ? 'Certificate' : 'Certificates'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;

