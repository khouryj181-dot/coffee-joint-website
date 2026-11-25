(function(){
    "use strict";
    const D = JSON.parse(document.getElementById("site-data").textContent);
    const app = document.getElementById("app");
    const escapeHtml = function(value){
      return String(value == null ? "" : value).replace(/[&<>"']/g,function(ch){
        return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];
      });
    };
    const fmt = function(value){ return "$" + Number(value).toFixed(2); };
    const fullAddress = D.address;
    const requestedPage = new URLSearchParams(location.search).get("page");
    const page = requestedPage === "menu" || requestedPage === "partners" ? requestedPage : "home";
    const homeHash = function(id){ return "?page=home#" + id; };
    const statusNow = function(){
      const now = new Date();
      const today = D.hours.find(function(h){ return h.day === now.getDay(); });
      const hours = now.getHours() + now.getMinutes()/60;
      if(hours >= today.open24 && hours < today.close24) return {open:true,label:"Open until " + today.close};
      const tomorrow = D.hours.find(function(h){ return h.day === (now.getDay()+1)%7; });
      return {open:false,label:hours < today.open24 ? "Opens " + today.open + " today" : "Opens " + tomorrow.open + " tomorrow"};
    };
    const image = function(src,alt,cls){ return "<img src='" + escapeHtml(src) + "' alt='" + escapeHtml(alt) + "' class='" + (cls || "") + "' loading='lazy'>"; };
    const link = function(href,label,cls,extra){ return "<a href='" + escapeHtml(href) + "' class='" + (cls || "") + "' " + (extra || "") + ">" + label + "</a>"; };
    const ddButton = function(label,cls){
      const text = label || "Order with DoorDash";
      return "<a class='dd-button " + (cls || "") + "' href='" + escapeHtml(D.delivery.url) + "' target='_blank' rel='noreferrer' aria-label='" + escapeHtml(text) + "'>" + image(D.delivery.logo,"","") + "<span>" + escapeHtml(text) + "</span></a>";
    };
    const phoneIcon = function(){return "<svg class='phone-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='M6.7 3.8 9.1 3.2l2.1 4.3-1.7 1.6a15 15 0 0 0 5.4 5.4l1.6-1.7 4.3 2.1-.6 2.4a2 2 0 0 1-2.2 1.5A16.8 16.8 0 0 1 5.2 6a2 2 0 0 1 1.5-2.2Z'/></svg>";};
    const instagramIcon = function(){return "<svg class='instagram-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' aria-hidden='true'><rect x='3' y='3' width='18' height='18' rx='5'/><circle cx='12' cy='12' r='4'/><circle cx='17.5' cy='6.5' r='1' fill='currentColor' stroke='none'/></svg>";};
    const instagramButton = function(cls){return link(D.business.instagram,instagramIcon()+"<span>Follow us</span>","instagram-button "+(cls||""),"target='_blank' rel='noreferrer' aria-label='Follow Coffee Joint on Napier on Instagram'");};
    const header = function(){
      const nav = [
        ["Our story",homeHash("story")],["Menu","?page=menu"],["Partners","?page=partners"],["Reviews",homeHash("reviews")],["Visit",homeHash("visit")]
      ];
      return "<header class='header' id='site-header'><a class='skip' href='#main'>Skip to content</a><div class='header-inner'>" +
        "<a class='brand' href='?page=home' aria-label='Coffee Joint on Napier — home'><span class='brand-mark'>" + image(D.logo,"Coffee Joint on Napier logo","") + "</span><span class='brand-copy'><span class='brand-name'>Coffee Joint</span><span class='brand-sub label'>on Napier · Essendon</span></span></a>" +
        "<nav class='nav' aria-label='Main'>" + nav.map(function(n){return link(n[1],escapeHtml(n[0]),"label");}).join("") + "</nav>" +
        "<div class='header-actions'>" + link(D.business.phoneHref,phoneIcon()+"<span>"+escapeHtml(D.business.phoneDisplay)+"</span>","phone-chip label","aria-label='Call Coffee Joint on Napier'") + instagramButton("header-instagram") + ddButton("Order online") + "</div>" +
        ddButton("Order online","dd-mobile") +
        "<button class='menu-toggle' type='button' id='menu-toggle' aria-label='Open menu' aria-expanded='false'>☰</button></div>" +
        "<div class='mobile-menu' id='mobile-menu' hidden><nav aria-label='Mobile'>" + nav.map(function(n){return link(n[1],escapeHtml(n[0]),"mobile-link");}).join("") + "</nav><div class='mobile-actions'>" +
        link(D.business.phoneHref,phoneIcon()+"&nbsp; Call " + escapeHtml(D.business.phoneDisplay),"button button-outline") +
        link(D.business.mapsLink,"⌖ &nbsp; Get directions","button button-roast","target='_blank' rel='noreferrer'") + ddButton("Order online") + instagramButton("mobile-instagram") +
        "</div><div class='social-row'>" + link(D.business.facebook,"Facebook ↗","label muted") + "</div></div></header>";
    };
    const footer = function(){
      const hours = D.hours.map(function(h){return "<li><span>" + h.label.slice(0,3) + "</span><span>" + h.open + " – " + h.close + "</span></li>";}).join("");
      return "<footer class='footer'><div class='wrap'><div class='footer-grid'><div><div class='footer-brand'><span class='footer-mark'>" + image(D.logo,"","") + "</span><span class='label accent'>Est. on Napier Street</span></div><p class='footer-tagline'>Your neighbourhood joint for coffee, breakfast and lunch in Essendon.</p><div class='social-row'>" + link(D.business.instagram,"instagram ↗","label muted") + link(D.business.facebook,"facebook ↗","label muted") + "</div></div>" +
        "<div><h2 class='label'>Find us</h2><address>" + escapeHtml(fullAddress) + "</address>" + link(D.business.phoneHref,phoneIcon()+" &nbsp;" + escapeHtml(D.business.phoneDisplay),"") + "<p>" + link(D.business.mapsLink,"⌖ &nbsp; Get directions","button button-outline","target='_blank' rel='noreferrer") + "</p></div>" +
        "<div><h2 class='label'>Open hours</h2><ul>" + hours + "</ul></div><div><h2 class='label'>More</h2><ul>" +
        "<li>" + link("?page=menu","Full menu","") + "</li><li>" + link("?page=partners","Our partners","") + "</li><li>" + link(homeHash("story"),"Our story","") + "</li><li>" + link(homeHash("visit"),"Visit the café","") + "</li><li>" + link(D.business.reviewLink,"Write a review","", "target='_blank' rel='noreferrer") + "</li></ul></div></div>" +
        "<div class='footer-bottom'><p>© " + new Date().getFullYear() + " Coffee Joint on Napier</p><p>Dine-in · Takeaway · Delivery across Essendon. Prices and hours as listed — please call to confirm seasonal changes.</p></div></div></footer>";
    };
    const hero = function(){
      return "<section class='hero' id='top' aria-label='Coffee Joint on Napier'><video class='hero-video' autoplay muted loop playsinline webkit-playsinline preload='metadata' aria-hidden='true' tabindex='-1'><source src='assets/videos/espresso-machine-making-coffee.mp4' type='video/mp4'></video><div class='hero-video-shade' aria-hidden='true'></div><div class='hero-content'><img class='hero-logo' src='assets/images/coffee-joint-white-transparent.png' alt='Coffee Joint on Napier' fetchpriority='high'><div class='hero-actions'>" + link("?page=menu","See the menu &nbsp; <span class='arrow'>→</span>","button button-cream") + link(D.business.mapsLink,"⌖ &nbsp; Get directions","button button-outline","target='_blank' rel='noreferrer'") + "</div></div></section>";
    };
    const stickyCall = function(){
      return "<a class='mobile-call' href='" + escapeHtml(D.business.phoneHref) + "' aria-label='Call Coffee Joint on Napier at " + escapeHtml(D.business.phoneDisplay) + "'><span class='mobile-call-icon'>"+phoneIcon()+"</span><span>Call café</span><span class='call-number'>" + escapeHtml(D.business.phoneDisplay) + "</span></a>";
    };
    const story = function(){
      const facts=[["4.6★","185 Google reviews"],["6:30am","Weekday opening"],["25","Napier St, Essendon"],["$20–40","Per person"]];
      return "<section class='section story' id='story'><div class='wrap story-grid'><div class='story-images reveal'><div class='story-image'>" + image(D.images.napierPatio,"A latte with heart art on a black pavement table outside the café's shopfront, with orange chairs lining the Napier Street entrance","") + "</div><p class='caption'>Pavement seating on Napier St · dogs and prams welcome</p><div class='story-image'>" + image(D.images.tableFeast,"Sourdough toast topped with sautéed spinach, mushrooms and pan-seared halloumi beside a bowl of tomato pasta and an iced coffee","") + "</div></div>" +
        "<div class='story-copy'><div class='reveal'><p class='label accent'>Our story</p><h2>A café that belongs to the street it sits on.</h2><p>Coffee Joint on Napier is the local you drop into on the way to work, the place to meet friends on a Saturday, and the takeaway flat white that gets you through the afternoon. Dine in, take away or order in — we do all three.</p><p>The kitchen runs from 6:30 am: free range eggs any which way, our really big breakfasts, kids menus, pressed paninis and rolls, salads and risottos made to order. The machine stays on for espresso, chai lattes and iced everything.</p><p>Regulars keep coming back for the same reason — a warm welcome, honest plates and coffee that tastes the way it should. That's what " + D.business.reviewCount + " Google reviews at " + D.business.rating + " stars keeps telling us.</p></div><dl class='facts reveal'>" + facts.map(function(f){return "<div><dt class='fact-value'>" + f[0] + "</dt><dd class='fact-label'>" + f[1] + "</dd></div>";}).join("") + "</dl></div></div></section>";
    };
    const signatures = function(){
      return "<section class='section signatures'><div class='wrap'><div class='section-top'><div class='section-top-row reveal'><div><p class='label accent'>From the menu</p><h2 class='section-heading'>The plates people come back for.</h2></div>" + link("?page=menu","Full menu &nbsp; →","section-link") + "</div><div class='cards-4'>" + D.signatures.map(function(item){return "<article class='signature-card reveal'><div style='overflow:hidden;border-radius:2px'>" + image(item.image,item.name,"") + "</div><h3>" + escapeHtml(item.name) + "</h3><p>" + escapeHtml(item.description) + "</p><p class='price label'>" + fmt(item.price) + "</p></article>";}).join("") + "</div></div></div></section>";
    };
    const reviews = function(){
      const quoteHtml=D.quotes.map(function(q){return "<blockquote><p>“" + escapeHtml(q.quote) + "”</p><cite>" + escapeHtml(q.source) + "</cite></blockquote>";}).join("");
      const reviewHtml=D.reviews.map(function(r){return "<article class='review-card reveal'><div class='stars' aria-label='5 out of 5 stars'>★★★★★</div><p>“" + escapeHtml(r.text) + "”</p>" + (r.response ? "<div class='response'><span class='response-label'>Response from the owner</span><p>" + escapeHtml(r.response) + "</p></div>" : "") + "<footer class='review-footer'><span class='review-name'>" + escapeHtml(r.name) + "</span><span class='review-meta'>" + escapeHtml(r.meta) + "</span></footer></article>";}).join("");
      return "<section class='section reviews' id='reviews'><div class='wrap reviews-grid'><div class='review-lead reveal'><p class='label' style='color:var(--roast-dark)'>The Napier verdict</p><h2>Rated " + D.business.rating + " by " + D.business.reviewCount + " neighbours and visitors.</h2>" + link(D.business.reviewLink,"Write a review! <span class='arrow'>↗</span>","button button-dark review-button","target='_blank' rel='noreferrer'") + "<p class='review-note'>Opens our Google Business profile in a new tab.</p><div class='quotes'>" + quoteHtml + "</div></div><div class='review-cards'>" + reviewHtml + "</div></div></section>";
    };
    const visit = function(){
      const status=statusNow(),today=new Date().getDay();
      const hours=D.hours.map(function(h){return "<li class='" + (h.day===today ? "today" : "") + "'><span>" + h.label + "</span><span>" + h.open + " – " + h.close + "</span></li>";}).join("");
      return "<section class='section visit' id='visit'><div class='wrap'><div class='visit-intro reveal'><p class='label accent'>Visit</p><h2 class='section-heading'>Two minutes from the Napier Street shops.</h2><p>Front-row tables under the awning for sunny mornings, a cosy room inside when the weather turns. Walk in, or call ahead for takeaway and delivery across Essendon.</p></div><div class='visit-grid'><div class='reveal'><div class='visit-image'>" + image(D.images.streetSeating,"Black table with a flat white, cutlery and orange chairs on the pavement outside the café","") + "<span class='label'>Outdoor seating on Napier St</span></div><div class='visit-buttons'>" + link(D.business.mapsLink,"⌖ &nbsp; Get directions","button button-cream","target='_blank' rel='noreferrer'") + link(D.business.phoneHref,"☎ &nbsp; Call the café","button button-outline") + "</div></div><div class='hours-card reveal'><div class='hours-head'><div><span class='label muted'>Address</span><address>" + escapeHtml(fullAddress) + "</address>" + link(D.business.phoneHref,escapeHtml(D.business.phoneDisplay),"") + "</div><span class='status " + (status.open?"open":"closed") + "'><i class='status-dot'></i><span class='label'>" + escapeHtml(status.label) + "</span></span></div><h3 class='hours-title label'>◷ &nbsp; Opening hours</h3><ul class='hours-list'>" + hours + "</ul><ul class='service-pills'>" + D.business.serviceModes.map(function(m){return "<li>" + escapeHtml(m) + "</li>";}).join("") + "</ul></div></div></div></section>";
    };
    const gallery = function(){
      const shots=[
        ["baristaTamping","Barista tamping freshly ground coffee into a portafilter"],
        ["croissantChai","Almond croissant beside a glass chai latte"],
        ["icedDrinks","Iced latte and iced matcha in tall glasses over ice"],
        ["bigBreakfast","A generous café breakfast plate with eggs, bacon and sourdough"],
        ["kiddyWaffle","Belgian waffle with vanilla ice cream and fairy floss"],
        ["frenchToast","French toast with berry coulis and vanilla yoghurt"],
        ["eggsBenedict","Eggs benedict with hollandaise and a hash brown breakfast roll"],
        ["burgerFries","House burger with a basket of golden chips"],
        ["baristaCups","Barista carrying two lattes with heart latte art"],
        ["paniniBoard","Pressed paninis stacked on a wooden board"],
        ["gnocchi","Potato gnocchi tossed through house-made pesto"]
      ];
      return "<section class='section gallery' id='gallery'><div class='wrap'><div class='section-top reveal'><p class='label accent'>On the pass</p><h2 class='section-heading'>A look inside the joint.</h2></div><div class='gallery-grid'>" + shots.map(function(s){return "<a href='" + escapeHtml(D.images[s[0]]) + "' target='_blank' rel='noreferrer' aria-label='View: " + escapeHtml(s[1]) + "'>" + image(D.images[s[0]],s[1],"") + "</a>";}).join("") + "</div></div></section>";
    };
    const homePage = function(){return header()+"<main id='main'>"+hero()+story()+signatures()+reviews()+visit()+gallery()+"</main>"+footer()+stickyCall();};
    const shortTitle = function(id,title){return ({breakfast:"Breakfast","kids-breakfast":"Kids breakfast",lunch:"Lunch","kids-lunch":"Kids lunch",panini:"Panini & rolls","hot-beverages":"Hot drinks","cold-beverages":"Cold drinks"})[id]||title;};
    const mostOrdered = function(){
      return "<section class='most-ordered' id='most-ordered'><div class='wrap'><div class='most-head'><div><p class='label' style='color:var(--roast-dark)'>Most ordered</p><h2>The most commonly ordered items and dishes from this store.</h2></div>"+ddButton()+"</div><div class='most-grid'>"+D.mostOrdered.map(function(item){return "<article class='most-card'><div class='most-image'>"+image(item.image,item.name,"")+"<a class='plus' href='"+escapeHtml(D.delivery.url)+"' target='_blank' rel='noreferrer' aria-label='Order "+escapeHtml(item.name)+" online'>+</a></div><h3>"+escapeHtml(item.name)+"</h3><p>"+escapeHtml(item.description)+"</p><p class='price'>"+fmt(item.price)+"</p></article>";}).join("")+"</div></div></section>";
    };
    const menuPage = function(){
      const sections=D.menu.map(function(s){
        const title=shortTitle(s.id,s.title);
        return "<section class='menu-section' id='"+escapeHtml(s.id)+"' data-menu-section><div class='reveal'>"+(s.image?"<div class='menu-section-image'>"+image(s.image,title+" at Coffee Joint on Napier","")+"<h2>"+escapeHtml(title)+"</h2></div>":"<h2 class='no-image'>"+escapeHtml(title)+"</h2>")+"<div class='menu-section-sub'><span>"+escapeHtml(s.note)+"</span><span class='label'>"+s.items.length+" "+(s.items.length===1?"item":"items")+"</span></div></div><div class='menu-items'>"+s.items.map(function(item){
          const search=escapeHtml((item.name+" "+(item.description||"")).toLowerCase());
          return "<article class='menu-item' data-menu-item data-search='"+search+"'><div style='display:flex;flex:1;flex-direction:column'><h3>"+escapeHtml(item.name)+"</h3>"+(item.description?"<p>"+escapeHtml(item.description)+"</p>":"")+"<span class='price'>"+fmt(item.price)+"</span></div>"+(item.image?image(item.image,item.name,""):"")+"</article>";
        }).join("")+"</div></section>";
      }).join("");
      const chips=D.menu.map(function(s){return "<li><button class='filter-chip' type='button' data-scroll='"+escapeHtml(s.id)+"'>"+escapeHtml(shortTitle(s.id,s.title))+"</button></li>";}).join("");
      const navHref="?page=menu";
      return header()+"<main id='main'><section class='page-hero'><div class='page-hero-bg'>"+image(D.images.heroPour,"","")+"</div><div class='wrap page-hero-content'><p class='label accent'>The full menu</p><h1>Everything we make, from 6:30 am to 3 pm.</h1><p>Breakfast, kids menus, lunch, paninis and rolls, hot drinks and cold drinks — all made to order in the kitchen on Napier Street.</p><div class='page-meta label'><span>"+escapeHtml(fullAddress)+"</span><span>6:30 am – 3 pm weekdays · 7 am – 3 pm weekends</span><span class='status "+(statusNow().open?"open":"closed")+"'><i class='status-dot'></i><span>"+escapeHtml(statusNow().label)+"</span></span></div></div></section>"+
        mostOrdered()+"<div class='menu-filter'><div class='wrap filter-inner'><div class='filter-row'><div class='search-wrap'><span class='search-icon' aria-hidden='true'>⌕</span><label class='sr-only' for='menu-search'>Search the menu</label><input id='menu-search' type='search' placeholder='Search the menu — eggs, chai, risotto…'><button id='clear-search' class='clear-search' type='button' aria-label='Clear search' hidden>×</button></div><nav class='filter-nav' aria-label='Menu sections'><ul style='display:flex;gap:7px;margin:0;padding:0;list-style:none'>"+chips+"</ul></nav></div><p id='match-count' class='match-count' hidden></p></div></div>"+
        "<div class='menu-content'><div class='wrap'><div id='menu-sections'>"+sections+"</div><div id='no-results' class='no-results' hidden><h2>Nothing matches that search.</h2><p>Try eggs, panini or chai — or give us a call and we'll sort you out.</p>"+link(D.business.phoneHref,"☎ &nbsp; "+escapeHtml(D.business.phoneDisplay),"button button-dark")+"</div></div></div>"+
        "<section class='ready'><div class='wrap ready-row'><div><p class='label accent'>Ready when you are</p><h2>Dine in, take away, or order online for delivery across Essendon.</h2></div><div class='ready-buttons'>"+ddButton("Order online")+" "+link(D.business.phoneHref,"☎ &nbsp; "+escapeHtml(D.business.phoneDisplay),"button button-roast")+" "+link(D.business.mapsLink,"⌖ &nbsp; Get directions","button button-outline","target='_blank' rel='noreferrer'")+"</div></div></section></main>"+footer()+stickyCall();
    };
    const partnersPage = function(){
      return header()+"<main id='main' class='partners-page'><section class='page-hero partner-intro'><div class='wrap page-hero-content'><p class='label accent'>Our partners</p><h1>Good coffee is a team effort.</h1><p>From the milk we steam to the coffee we pull, these are the two partners behind the drinks at Coffee Joint on Napier.</p><div class='page-meta label'><span>25 Napier St · Essendon</span><span>Made for the cup, served on Napier</span></div></div></section><section class='partner-list'><div class='wrap'>"+
        "<article class='partner-feature'><div class='partner-brand-panel milklab-panel'><img class='partner-logo milklab-logo' src='assets/images/partners/milklab-logo.png' alt='MILKLAB logo' loading='lazy'></div><div class='partner-copy'><p class='label accent'>Café milk partner</p><h2>MILKLAB</h2><p class='partner-deck'>Barista milks made to complement coffee.</p><p>MILKLAB began in 2015 with a range of alternative milks for hospitality. Its current range includes plant-based and dairy options developed for café coffee, with a focus on texture, stretch and a creamy mouthfeel.</p><p>The brand says its products are made at facilities in Shepparton, Victoria, and Ingleburn, New South Wales. At Coffee Joint, MILKLAB is part of the milk choices behind the café’s coffee menu.</p><div class='partner-links'>"+link("https://www.milklab.com.au/about-us","MILKLAB story ↗","partner-link","target='_blank' rel='noreferrer'")+link("https://www.milklab.com.au/our-range","Explore the range ↗","partner-link","target='_blank' rel='noreferrer'")+"</div></div><figure class='partner-photo milklab-photo'><img src='assets/images/partners/milklab-strawberry-oat-matcha.jpg' alt='MILKLAB strawberry candy oat matcha drink' loading='lazy'><figcaption>Strawberry candy oat matcha · MILKLAB</figcaption></figure></article>"+
        "<article class='partner-feature bean-feature'><figure class='partner-photo bean-photo'><img src='assets/images/partners/bean-cartel-cup.jpg' alt='Coffee in a colourful cup bearing The Bean Cartel logo' loading='lazy'><figcaption>A cup featuring The Bean Cartel mark</figcaption></figure><div class='partner-brand-panel bean-panel'><img class='partner-logo bean-logo' src='assets/images/partners/bean-cartel-logo.png' alt='The Bean Cartel logo' loading='lazy'></div><div class='partner-copy'><p class='label accent'>Coffee roasting partner</p><h2>The Bean Cartel</h2><p class='partner-deck'>Melbourne roasted specialty coffee.</p><p>The Bean Cartel is a Melbourne roaster based in Notting Hill. The company describes its approach as sourcing coffees from around the world, roasting each origin, then post-blending at its local roastery.</p><p>Its wholesale program supplies cafés and businesses, with options such as dedicated account support, barista training and equipment assistance. Coffee Joint’s partnership brings that local roasting expertise to the coffee served on Napier Street.</p><div class='partner-accolades'><span class='label muted'>Golden Bean Australasia · 2025</span><strong>Double Gold · Runner-Up Overall Champion</strong><span class='label muted'>Golden Bean World Series · 2026</span><strong>Silver · Two Bronze</strong><small>Recognition reported by The Bean Cartel.</small></div><div class='partner-links'>"+link("https://www.thebeancartel.com.au/pages/specialty-coffee","Coffee, wholesale & awards ↗","partner-link","target='_blank' rel='noreferrer'")+link("https://www.thebeancartel.com.au/pages/about-tbc","Meet The Bean Cartel ↗","partner-link","target='_blank' rel='noreferrer'")+"</div></div></article>"+
        "<div class='partner-note'><p class='label muted'>Good things in every cup</p><p>Next time you visit, ask the team which beans and milk options are available for your drink.</p></div></div></section></main>"+footer()+stickyCall();
    };
    app.innerHTML = (page==="menu" ? menuPage() : page==="partners" ? partnersPage() : homePage());
    document.body.classList.toggle("light-page",page==="menu");

    const seoByPage={
      home:{title:"Coffee Joint on Napier | Essendon Café, Melbourne",description:"Coffee Joint on Napier is an Essendon, Melbourne café for specialty coffee, breakfast, brunch and lunch. Dine in, takeaway or delivery."},
      menu:{title:"Essendon Café Menu | Coffee Joint on Napier",description:"Explore breakfast, brunch, lunch and coffee at Coffee Joint on Napier in Essendon, Melbourne. Dine in, takeaway or order delivery."},
      partners:{title:"Our Coffee Partners | Coffee Joint on Napier, Essendon",description:"Meet Coffee Joint on Napier’s café milk partner MILKLAB and Melbourne coffee roaster The Bean Cartel. Learn about the people and products behind our coffee."},
    };
    const seo=seoByPage[page]||seoByPage.home;
    document.title=seo.title;
    document.getElementById("seo-description").setAttribute("content",seo.description);
    document.getElementById("seo-og-title").setAttribute("content",seo.title);
    document.getElementById("seo-og-description").setAttribute("content",seo.description);
    document.getElementById("seo-twitter-title").setAttribute("content",seo.title);
    document.getElementById("seo-twitter-description").setAttribute("content",seo.description);
    if(location.protocol==="http:"||location.protocol==="https:"){
      const rootPath=location.pathname.replace(/index\.html$/i,"");
      const rootUrl=new URL(rootPath||"/",location.origin);
      const canonicalUrl=new URL(rootUrl.href);
      if(page!=="home")canonicalUrl.searchParams.set("page",page);
      canonicalUrl.hash="";
      document.getElementById("seo-canonical").setAttribute("href",canonicalUrl.href);
      document.getElementById("seo-og-url").setAttribute("content",canonicalUrl.href);
      const businessSchema=JSON.parse(document.getElementById("local-business-schema").textContent);
      businessSchema.url=rootUrl.href;
      businessSchema.menu=new URL("?page=menu",rootUrl.href).href;
      document.getElementById("local-business-schema").textContent=JSON.stringify(businessSchema);
    }
    const headerEl=document.getElementById("site-header");
    const onScroll=function(){if(headerEl)headerEl.classList.toggle("scrolled",window.scrollY>40);};
    window.addEventListener("scroll",onScroll,{passive:true});onScroll();
    const toggle=document.getElementById("menu-toggle");
    if(toggle){
      toggle.addEventListener("click",function(){
        const drawer=document.getElementById("mobile-menu"),open=drawer.hidden;
        drawer.hidden=!open;toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Close menu":"Open menu");
        toggle.textContent=open?"×":"☰";headerEl.classList.toggle("drawer-open",open);
      });
    }
    document.querySelectorAll("[data-scroll]").forEach(function(btn){
      btn.addEventListener("click",function(){const target=document.getElementById(btn.getAttribute("data-scroll"));if(target)target.scrollIntoView({behavior:"smooth",block:"start"});});
    });
    const search=document.getElementById("menu-search");
    if(search){
      const clear=document.getElementById("clear-search"),count=document.getElementById("match-count"),empty=document.getElementById("no-results"),most=document.getElementById("most-ordered");
      const updateSearch=function(){
        const query=search.value.trim().toLowerCase();let total=0;
        document.querySelectorAll("[data-menu-section]").forEach(function(section){
          let sectionCount=0;
          section.querySelectorAll("[data-menu-item]").forEach(function(item){
            const match=!query||item.getAttribute("data-search").includes(query);
            item.hidden=!match;if(match){sectionCount++;total++;}
          });
          section.hidden=sectionCount===0;
        });
        if(most)most.hidden=!!query;
        clear.hidden=!query;
        count.hidden=!query;
        if(query){count.textContent=total+" "+(total===1?"item":"items")+" matching “"+search.value.trim()+"”";}
        empty.hidden=total>0;
      };
      search.addEventListener("input",updateSearch);
      clear.addEventListener("click",function(){search.value="";updateSearch();search.focus();});
    }
    const revealNodes=document.querySelectorAll(".reveal");
    if("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
      const observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("shown");observer.unobserve(entry.target);}});},{threshold:.08,rootMargin:"0px 0px -3% 0px"});
      revealNodes.forEach(function(el){observer.observe(el);});
    }else revealNodes.forEach(function(el){el.classList.add("shown");});
  })();
