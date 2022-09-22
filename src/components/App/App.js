import './App.css';
import React, {Component} from "react";
import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom';
import ShoppingCarts from '../ShoppingCarts/ShoppingCartList/ShoppingCarts'
import Books from '../Books/BookList/books';
import Authors from '../Authors/AuthorList/authors';
import Header from '../Header/header';
import BookAdd from '../Books/BookAdd/bookAdd';
import BookEdit from "../Books/BookEdit/bookEdit";
import ShoppingCartService from "../../repository/shoppingCartRepository";
import BookService from "../../repository/bookRepository";
import AuthorService from "../../repository/authorRepository";
import BookItemList from "../ShoppingCarts/ShoppingCartGetBookItems/bookItemList";
import ShoppingCartOrderNow from "../ShoppingCarts/ShoppingCartOrderNow/shoppingCartOrderNow";
import AuthorAdd from "../Authors/AuthorAdd/authorAdd";
import AuthorEdit from "../Authors/AuthorEdit/authorEdit";
import BookItemAdd from "../ShoppingCarts/ShoppingCartAddItem/bookItemAdd";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            shoppingCarts: [],
            books: [],
            authors: [],
            selectedBook: {},
            selectedBookItems: {},
            selectedShoppingCart: {},
            selectedAuthor: {}
        }
    }

    render() {
        return (
            <Router>
                <Header/>
                <main>
                    <div className={"container"}>

                        <Route path={"/shoppingCarts/addItem/:id"} exact render={() =>
                            <BookItemAdd shoppingCart={this.state.selectedShoppingCart} onAddItem={this.addItem}/>}/>

                        <Route path={"/shoppingCarts/bookItems/:id"} exact render={() =>
                            <BookItemList shoppingCart={this.state.selectedShoppingCart} bookItems={this.state.selectedBookItems} onGetBookItems={this.getAllItemsOfCart}/>}/>

                        <Route path={"/shoppingCarts/orderNow"} exact render={() =>
                            <ShoppingCartOrderNow authors={this.state.authors} books={this.state.books} onOrderNow={this.orderNow}/>}/>

                        <Route path={"/shoppingCarts"} exact render={() =>
                            <ShoppingCarts shoppingCarts={this.state.shoppingCarts} onGetItems={this.getShoppingCart}/>}/>

                        <Route path={"/books/add"} exact render={() =>
                            <BookAdd authors={this.state.authors} onAddBook={this.addBook} />}/>

                        <Route path={"/books/edit/:id"} exact render={() =>
                            <BookEdit authors={this.state.authors} onEditBook={this.editBook} book={this.state.selectedBook}/>}/>

                        <Route path={"/books"} exact render={() =>
                            <Books books={this.state.books} onDelete={this.deleteBook} onEdit={this.getBook}/>}/>

                        <Route path={"/authors/add"} exact render={() =>
                            <AuthorAdd onAddAuthor={this.addAuthor}/>}/>

                        <Route path={"/authors/edit/:id"} exact render={() =>
                            <AuthorEdit author={this.state.selectedAuthor} onEditAuthor={this.editAuthor}/>}/>

                        <Route path={"/authors"} exact render={() =>
                            <Authors authors={this.state.authors} onDelete={this.deleteAuthor} onEdit={this.getAuthor}/>}/>

                        <Redirect to={"/shoppingCarts"}/>
                    </div>
                </main>
            </Router>
        );
    }


    componentDidMount() {
        this.loadShoppingCarts();
        this.loadBooks();
        this.loadAuthors();
    }


    loadShoppingCarts = () => {
        ShoppingCartService.fetchShoppingCarts()
            .then((data) => {
                this.setState({
                    shoppingCarts: data.data
                });
            });
    }

    loadBooks = () => {
        BookService.fetchBooks()
            .then((data) => {
                this.setState({
                    books: data.data
                });
            });
    }

    loadAuthors = () => {
        AuthorService.fetchAuthors()
            .then((data) => {
                this.setState({
                    authors: data.data
                });
            });
    }

    deleteBook = (id) => {
        BookService.deleteBook(id)
            .then(() => {
                this.loadBooks();
            });
    }

    addBook = (isbn, title, category, yearPublished, authorId, amount, currency, inStock) => {
        BookService.addBook(isbn, title, category, yearPublished, authorId, amount, currency, inStock)
            .then(() => {
                this.loadBooks();
            });
    }

    getBook = (id) => {
        BookService.getBook(id)
            .then((data) => {
                console.log("SELECTED BOOK")
                console.log(data.data)
                this.setState({
                    selectedBook: data.data
                })
                console.log(this.state.selectedBook.price.amount)
            });
    }

    editBook = (id, isbn, title, category, yearPublished, authorId, amount, currency, inStock) => {
        BookService.editBook(id, isbn, title, category, yearPublished, authorId, amount, currency, inStock)
            .then(() => {
                this.loadBooks();
            });
    }

    getShoppingCart = (id) => {
        ShoppingCartService.getShoppingCart(id)
            .then((data) => {
                console.log("SELECTED SHOPPING CART data.data:")
                console.log(data.data)
                this.setState({
                    selectedShoppingCart: data.data,
                    selectedBookItems: data.data.bookItemList
                });
                console.log("SELECTED SHOPPING CART selectedShoppingCart:")
                console.log(this.state.selectedShoppingCart)
            })
    }

    getAllItemsOfCart = (id) => {
        ShoppingCartService.getAllItemsOfShoppingCart(id)
            .then((data) => {
                console.log("SELECTED SHOPPING CART getAllItemsOfCart:")
                console.log(data.data)
                this.setState({
                    selectedShoppingCartId: id,
                    selectedBookItems: data.data,
                });
            });
    }

    orderNow = (currency, bookId, isbn, title, category, yearPublished, authorId, amount, inStock, quantity) => {
        ShoppingCartService.orderNow(currency, bookId, isbn, title, category, yearPublished, authorId, amount, inStock, quantity)
            .then(() => {
                this.loadShoppingCarts();
            });
    }

    addItem = (id, bookId, isbn, title, category, yearPublished, authorId, amount, currency, inStock, quantity) => {
        ShoppingCartService.addItem(id, bookId, isbn, title, category, yearPublished, authorId, amount, currency, inStock, quantity)
            .then(() => {
                this.loadShoppingCarts();
            });
    }

    addAuthor = (name, surname, address, url) => {
        AuthorService.addAuthor(name, surname, address, url)
            .then(() => {
                this.loadAuthors();
            });
    }

    editAuthor = (id, name, surname, address, url) => {
        AuthorService.editAuthor(id, name, surname, address, url)
            .then(() => {
                this.loadAuthors();
            });
    }

    deleteAuthor = (id) => {
        AuthorService.deleteAuthor(id)
            .then(() => {
                this.loadAuthors();
            });
    }

    getAuthor = (id) => {
        AuthorService.getAuthor(id)
            .then((data) => {
                console.log("SELECTED AUTHOR")
                console.log(data.data)
                this.setState({
                    selectedAuthor: data.data
                })
                console.log(this.state.selectedAuthor)
            });
    }
}

export default App;
