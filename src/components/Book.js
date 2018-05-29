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
    const { thumbnail, name, author, year, description } = this.state.book;

    return (
      <div className="recommendation">
        { thumbnail &&
          <div className="img-wrapper">
            { year && <div className="year">{year}</div> }
            <img class="img" src={thumbnail} />
          </div>
        }
        <h2 className="headline">{name}</h2>
        <p className="author">{author}</p>
      </div>
    )
  }
}

export default Book;