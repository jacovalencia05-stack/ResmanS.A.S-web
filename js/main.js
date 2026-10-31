 document.addEventListener("DOMContentLoaded", function () {
  // ---- Menú desplegable en celular ----
  var botonMenu = document.getElementById("boton-menu");
  var menu = document.getElementById("menu");

  if (botonMenu && menu) {
    botonMenu.addEventListener("click", function () {
      var abierto = menu.classList.toggle("abierto");
      botonMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
    });

    // Al tocar un enlace del menú, se cierra (útil en el celular)
    menu.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        menu.classList.remove("abierto");
        botonMenu.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---- Sombra del encabezado al hacer scroll ----
  var encabezado = document.getElementById("encabezado");
  if (encabezado) {
    var revisarScroll = function () {
      encabezado.classList.toggle("con-sombra", window.scrollY > 10);
    };
    revisarScroll();
    window.addEventListener("scroll", revisarScroll, { passive: true });
  }

  // ---- Marcar el enlace de la página actual en el menú ----
  var paginaActual = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach(function (enlace) {
    if (enlace.getAttribute("href") === paginaActual && !enlace.classList.contains("boton-nav")) {
      enlace.classList.add("activo");
    }
  });

  // ---- Año automático en el pie de página ----
  var anio = document.getElementById("anio");
  if (anio) {
    anio.textContent = new Date().getFullYear();
  }

  // ---- Aparición de elementos al hacer scroll ----
  var elementos = document.querySelectorAll(".reveal");
  var sinAnimacion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !sinAnimacion) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.12 });

    elementos.forEach(function (el, i) {
      // pequeño retraso escalonado para las tarjetas hermanas
      el.style.transitionDelay = (i % 3) * 80 + "ms";
      observador.observe(el);
    });
  } else {
    elementos.forEach(function (el) { el.classList.add("visible"); });
  }

  // ---- Contadores animados (22 años, 100 %) ----
  var contadores = document.querySelectorAll("[data-contador]");

  function animarContador(el) {
    var meta = parseInt(el.getAttribute("data-contador"), 10);
    var duracion = 1400;
    var inicio = null;

    function paso(t) {
      if (inicio === null) inicio = t;
      var avance = Math.min((t - inicio) / duracion, 1);
      el.textContent = Math.round(meta * avance);
      if (avance < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  if ("IntersectionObserver" in window && !sinAnimacion) {
    var observadorCifras = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          animarContador(entrada.target);
          observadorCifras.unobserve(entrada.target);
        }
      });
    }, { threshold: 0.6 });
    contadores.forEach(function (c) { observadorCifras.observe(c); });
  }

  // ---- Validación sencilla del formulario de contacto ----
  var formulario = document.getElementById("formulario-contacto");
  var mensaje = document.getElementById("mensaje-form");

  if (formulario && mensaje) {
    formulario.addEventListener("submit", function (evento) {
      var nombre = formulario.querySelector("[name='nombre']").value.trim();
      var correo = formulario.querySelector("[name='email']").value.trim();
      var texto = formulario.querySelector("[name='mensaje']").value.trim();
      var correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

      mensaje.className = "mensaje-form";

      if (!nombre || !texto || !correoValido) {
        evento.preventDefault();
        mensaje.classList.add("error");
        mensaje.textContent = "Por favor completa tu nombre, un correo válido y tu mensaje.";
        return;
      }

      mensaje.classList.add("exito");
      mensaje.textContent = "Enviando tu mensaje...";
    });
  }
});
