import React from 'react';
import './App.css';

import background0 from "./img/icon.png"

function App() {
    return (
        <div>
            <nav class="navbar background">
                <ul class="nav-list">
                    <div class="logo">
                        <img src=
{background0} />
                    </div>
                    <li><a href="#our-products">Our Products</a></li>
                    <li><a href="#about-us">About Us</a></li>
                    <li><a href="#contact-us">Contact Us</a></li>
                </ul>
  
            </nav>
  
           <section class="section">
                <div class="box-main">
                    <div class="firstHalf">
                        <h1 class="text-big">
                           Coffee 1
                        </h1>
                        <p class="text-small">
                          Coffee 1
                        </p>
                    </div>
                </div>
            </section>
            <section class="section">
                <div class="box-main">
                    <div class="secondHalf">
                        <h1 class="text-big" id="program">
                            Coffee 2
                        </h1>
                        <p class="text-small">
                            Coffee 2
                        </p>
                    </div>
                </div>
            </section>
            <section class="section">
                <div class="box-main">
                    <div class="secondHalf">
                        <h1 class="text-big" id="program">
                            Coffee 3
                        </h1>
                        <p class="text-small">
                            Coffee 3
                        </p>
                    </div>
                </div>
            </section>
            <section class="section">
                <div class="box-main">
                    <div class="secondHalf">
                        <h1 class="text-big" id="program">
                            Coffee 4
                        </h1>
                        <p class="text-small">
                            Coffee 4
                        </p>
                    </div>
                </div>
            </section>
            <footer className="footer">
                <p className="text-footer">
                    Copyright ©-All rights are reserved
                </p>
            </footer>
        </div>
    )
}
  
export default App