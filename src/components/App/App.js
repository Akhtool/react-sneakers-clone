import { useEffect, useState } from "react";
import { Context } from "../../context/Context.js";
import axios from "axios";
import {
  SNEAKERS_URL,
  CART_ITEMS_URL,
  FAVORITES_URL,
  ORDERS_URL,
} from "../../api";
import "./App.css";
import Header from "../Header/Header.js";
import Drawer from "../Drawer/Drawer.js";
import Home from "../../pages/Home.js";
import Orders from "../../pages/Orders/Orders.js";
import Profile from "../../pages/Profile/Profile.js";
import { Routes, Route, useNavigate } from "react-router-dom";
import Favorites from "../../pages/Favorites/Favorites.js";
import {
  SNEAKERS_URL,
  CART_ITEMS_URL,
  FAVORITES_URL,
  ORDERS_URL,
} from "../../api";

function App() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isCardsLoading, setIsCardsLoading] = useState(true);
  const [isCartItemsLoading, setIsCartItemsLoading] = useState(true);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(true);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);


  const totalPrice = cartItems.reduce((sum, obj) => obj.price + sum, 0);
  const cartItemsQuantity = cartItems.length;
  const favoritesQuantity = favorites.length;

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const getSneakersCards = async () => {
    try {
      const { data } = await axios.get(SNEAKERS_URL);
      setCards(data);
    } catch (err) {
      alert("Не удалось загрузить список кроссовок");
      console.log(err);
    } finally {
      setIsCardsLoading(false);
    }
  };

  const getCartItems = async () => {
    try {
      const { data } = await axios.get(CART_ITEMS_URL);
      setCartItems(data);
    } catch (err) {
      alert("Ошибка при загрузке корзины");
      console.log(err);
    } finally {
      setIsCartItemsLoading(false);
    }
  };

  const getFavorites = async () => {
    try {
      const { data } = await axios.get(FAVORITES_URL);
      setFavorites(data);
    } catch (err) {
      alert("Ошибка при загрузке избранного");
      console.log(err);
    } finally {
      setIsFavoritesLoading(false);
    }
  };

  const getOrders = async () => {
    try {
      const { data } = await axios.get(ORDERS_URL);
      setOrders(data);
    } catch (err) {
      alert("Ошибка при загрузке заказов");
      console.log(err);
    } finally {
      setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    getSneakersCards();
    getCartItems();
    getFavorites();
    getOrders();
  }, []);

  const handleDrawerOpenClick = () => {
    setDrawerOpen(true);
  };

  const handleDrawerCloseClick = () => {
    setDrawerOpen(false);
  };
  const onAddToCart = (sneaker) => {
    const existingCartItem = cartItems.find(
      (item) => item.sneakerId === sneaker.sneakerId
    );
    if (!existingCartItem) {
      axios
        .post(CART_ITEMS_URL, sneaker)
        .then((res) => setCartItems([...cartItems, res.data]))
        .catch((err) => console.log(err));
    }
  };

  const onRemoveItem = (sneakerId) => {
    const item = cartItems.find((el) => el.sneakerId === sneakerId);
    if (item) {
      axios.delete(`${CART_ITEMS_URL}/${item.id}`);
      setCartItems(cartItems.filter((el) => el.sneakerId !== sneakerId));
=======
  const onAddToCart = async (sneaker) => {
    const existingCartItem = cartItems.find((item) => item.id === sneaker.id);
    if (!existingCartItem) {
      try {
        setCartItems([...cartItems, sneaker]);
        await axios.post(CART_ITEMS_URL, sneaker);
      } catch (err) {
        alert("Не удалось добавить в корзину");
        console.log(err);
      }
    }
  };

  const onRemoveItem = async (id) => {
    try {
      await axios.delete(`${CART_ITEMS_URL}/${id}`);
      setCartItems(cartItems.filter((item) => item.id !== id));
    } catch (err) {
      alert("Не удалось удалить товар из корзины");
      console.log(err);
    }
  };

  const onAddToFavorite = async (sneaker) => {
    const existingFavoriteItem = favorites.find(
      (item) => item.id === sneaker.id
    );
    if (!existingFavoriteItem) {
      try {
        setFavorites([...favorites, sneaker]);
        await axios.post(FAVORITES_URL, sneaker);
      } catch (err) {
        alert("Не удалось добавить в избранное");
        console.log(err);
      }
    }
  };

  const onRemoveFavorite = async (id) => {
    try {
      await axios.delete(`${FAVORITES_URL}/${id}`);
      setFavorites(favorites.filter((item) => item.id !== id));
    } catch (err) {
      alert("Не удалось удалить из избранного");
      console.log(err);
    }
  };

  const payOrder = (id) => {
    axios
      .patch(`${ORDERS_URL}/${id}`, { isPaid: true })
      .then((res) =>
        setOrders(orders.map((order) => (order.id === id ? res.data : order)))
      )
      .catch((err) => console.log(err));
  };

  const payOrder = (id) => {
    axios
      .patch(`${ORDERS_URL}/${id}`, { isPaid: true })
      .then((res) =>
        setOrders(orders.map((order) => (order.id === id ? res.data : order)))
      )
      .catch((err) => console.log(err));
  };

  return (
    <Context.Provider
      value={{
        cartItems,
        setCartItems,
        isAdded,
        setIsAdded,
        favorites,
        orders,
        setOrders,
        totalPrice,
        setCards,
        setIsCardsLoading,
        onRemoveItem,
        goBack,
        cartItemsQuantity,
        favoritesQuantity,
        getSneakersCards,
        payOrder,
      }}
    >
      <div className="app">
        <Drawer
          isDrawerOpen={isDrawerOpen}
          handleDrawerCloseClick={handleDrawerCloseClick}
          isCartItemsLoading={isCartItemsLoading}
          onRemove={onRemoveItem}
        />
        <Header handleDrawerOpenClick={handleDrawerOpenClick} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isCardsLoading={isCardsLoading}
                cards={cards}
                onAddToCart={onAddToCart}
                onAddToFavorite={onAddToFavorite}
                onRemoveFavorite={onRemoveFavorite}
              />
            }
            exact
          />
          <Route
            path="/favorites"
            element={
              <Favorites
                isFavoritesLoading={isFavoritesLoading}
                onAddToCart={onAddToCart}
                onRemove={onRemoveItem}
                onAddToFavorite={onAddToFavorite}
                onRemoveFavorite={onRemoveFavorite}
              />
            }
            exact
          />
          <Route
            path="/orders"
            element={
              <Orders
                isOrdersLoading={isOrdersLoading}
                onAddToCart={onAddToCart}
                onAddToFavorite={onAddToFavorite}
                onRemoveFavorite={onRemoveFavorite}
              />
            }
            exact
          ></Route>
          <Route path="/profile" element={<Profile />} exact></Route>
        </Routes>

        <footer className="footer">
          <h3 className="footer__title">React Sneakers by Akhtool</h3>
        </footer>
      </div>
    </Context.Provider>
  );
}

export default App;
