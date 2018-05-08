import React, {Component} from 'react';

class Book extends Component {

  constructor(props) {
    super();
    const books = props.books;

    this.state = {
      book: books[books.length-1]
    }

  }

  render() {
    const { image, name, author, description } = this.state.book;

    return (
      <div className="recommendation">
        <div className="img-wrapper">
          <div className="img" style={{backgroundImage: 'url('+image+')'}}></div>
        </div>

        <h2 className="headline">{name}</h2>
        <p className="author">{author}</p>
        <p className="description">{description}</p>
      </div>
    )
  }
}

export default Book;