import React, {Component} from 'react';

class BookDescription extends Component {

  constructor(props) {
    super();
    const books = props.books;

    this.state = {
      book: books[books.length-1]
    }

  }

  render() {
    const {description, name} = this.state.book;

    return (
      <div className="description">
        <h2 class="name">{name}</h2>
        <p>{description}</p>
      </div>
    )
  }
}

export default BookDescription;