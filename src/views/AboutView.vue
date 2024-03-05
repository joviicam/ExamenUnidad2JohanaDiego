<template>
  <div id="about" class="bg-image" :style="{
    'background-image': `url(${require('../assets/jujutsu.jpg')})`,
  }">
    <div style="margin: 10px; padding: 10px">
      <b-carousel id="carousel-1" v-model="slide" :interval="4000" controls indicators background="#ababab"
        img-width="1024" img-height="480" style="text-shadow: 1px 1px 2px #333" @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd">
        <!-- Text slides with image -->
        <b-carousel-slide caption="First slide" text="Nulla vitae elit libero, a pharetra augue mollis interdum."
          img-src="https://picsum.photos/1024/480/?image=52"></b-carousel-slide>

        <!-- Slides with custom text -->
        <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54">
          <h1>Hello world!</h1>
        </b-carousel-slide>

        <!-- Slides with image only -->
        <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=58"></b-carousel-slide>

        <!-- Slides with img slot -->
        <!-- Note the classes .d-block and .img-fluid to prevent browser default image alignment -->
        <b-carousel-slide>
          <template #img>
            <img class="d-block img-fluid w-100" width="1024" height="480"
              src="https://picsum.photos/1024/480/?image=55" alt="image slot" />
          </template>
        </b-carousel-slide>

        <!-- Slide with blank fluid image to maintain slide aspect ratio -->
        <b-carousel-slide caption="Blank Image" img-blank img-alt="Blank image">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            eros felis, tincidunt a tincidunt eget, convallis vel est. Ut
            pellentesque ut lacus vel interdum.
          </p>
        </b-carousel-slide>
      </b-carousel>

      <p class="mt-4">
        Slide #: {{ slide }}<br />
        Sliding: {{ sliding }}
      </p>
    </div>
    <header class="text-light text-center py-3" style="flex: 1 0 auto">
      <button class="btn btn-primary" @click="getBooksByAuthor()">
        Consultar por autor
      </button>
      <button class="btn btn-primary" @click="getBooksByReleaseDate()">
        Ordenar por fecha
      </button>
      <button class="btn btn-primary" @click="getBooksByImage()">
        Mostrar si tiene imagen
      </button>

      <!--       <a href="consultar" class="btn btn-primary btn-lg mt-3">Da click</a>
 -->
    </header>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col-6 col-md-6 col-lg-4" v-for="libro in libros" :key="libro.idBook" draggable
        @dragstart="startDrag($event, libro)">
        <b-card :title="libro.titulo" :sub-title="libro.autor" :img-src="libro.imagen" img-alt="Image" img-top
          tag="article" style="max-width: 20rem" class="mb-2">
          <b-card-text>
            <p class="card-text">
              <small class="text-muted">Publicado en {{ libro.fecha }}</small>
            </p>
          </b-card-text>
        </b-card>
      </div>
      <button class="btn btn-primary" v-b-modal.modal-create>
        Registrar <i class="fas fa-plus"></i>
      </button>
      <div style="
          margin: 10px;
          padding: 10px;
          text-align: center;
          background-color: blueviolet;
        " @drop="onDrop($event)" @dragover.prevent @dragenter.prevent>
        <p><i class="fas fa-plus"></i> Modificar</p>
      </div>
      <div style="
          margin: 10px;
          padding: 10px;
          text-align: center;
          background-color: brown;
        " @drop="onDropDelete($event)" @dragover.prevent @dragenter.prevent>
        <p><i class="fas fa-plus"></i> Eliminar</p>
      </div>
    </div>

    <footer class="text-light text-center py-3">
      <p>&copy; Todos los derechos reservados.</p>
      <div class="social-icons mt-3">
        <a href="#" class="text-light me-3"><i class="fab fa-twitter"></i></a>
        <a href="#" class="text-light me-3"><i class="fab fa-facebook"></i></a>
        <a href="#" class="text-light me-3"><i class="fab fa-linkedin"></i></a>
        <a href="#" class="text-light"><i class="fab fa-instagram"></i></a>
      </div>
    </footer>

    <!-- MODALES -->
    <!-- Debe tener estos campos: Nombre de libro, autor, fecha de publicación, imagen de portada (opcional). -->
    <b-modal id="modal-create" ref="modal-create" title="Registrar ibro" @show="resetModal" @hidden="resetModal">
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group label="Name" label-for="name-input" invalid-feedback="Name is required" :state="nameCreateState">
          <b-form-input id="name-input" v-model="libroCreate.name" :state="nameCreateState" required></b-form-input>
        </b-form-group>
        <b-form-group label="Author" label-for="author-input" invalid-feedback="Author is required"
          :state="authorCreateState">
          <b-form-input id="author-input" v-model="libroCreate.author" :state="authorCreateState"
            required></b-form-input>
        </b-form-group>
        <b-form-group label="date" label-for="date-input" invalid-feedback="Date is required" :state="dateCreateState">
          <b-form-input id="date-input" v-model="libroCreate.date" :state="dateCreateState" type="date"
            required></b-form-input>
        </b-form-group>
        <b-form-group label="Image" label-for="image-input" :state="imageCreateState">
          <b-form-file id="image-input" v-model="libroCreate.image" :state="imageCreateState"
            accept="image/*"></b-form-file>
          <b-form-invalid-feedback :state="imageCreateState">
            Please select an image
          </b-form-invalid-feedback>
        </b-form-group>
        <b-button type="submit" variant="primary" @click="createBook">Registrar</b-button>
      </form>
    </b-modal>
    <!-- MODAL ACTUALIZAR -->
    <!-- Debe tener estos campos: Nombre de libro, autor, fecha de publicación, imagen de portada (opcional). -->

    <b-modal id="modal-prevent-closing" ref="modal-prevent-closing" title="Actualizar libro" @show="resetModal"
      @hidden="resetModal">
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group label="Name" label-for="name-input" invalid-feedback="Name is required" :state="nameUpdateState">
          <b-form-input id="name-input" v-model="libroUpdateName" :state="nameUpdateState" required></b-form-input>
        </b-form-group>
        <b-form-group label="Author" label-for="author-input" invalid-feedback="Author is required"
          :state="authorUpdateState">
          <b-form-input id="author-input" v-model="libroUpdateAuthor" :state="authorUpdateState"
            required></b-form-input>
        </b-form-group>
        <b-form-group label="Fecha de estreno" label-for="fecha-input" invalid-feedback="Date is required"
          :state="dateUpdateState">
          <b-form-input id="fecha-input" v-model="libroUpdateDate" :state="dateUpdateState" type="date"
            required></b-form-input>
        </b-form-group>
        <b-form-group label="Image" label-for="duration-input" invalid-feedback="Image is required"
          :state="imageUpdateState">
          <b-form-file id="duration-input" v-model="libroUpdateImage" :state="imageUpdateState"
            accept="image/*"></b-form-file>
          <b-form-invalid-feedback :state="imageUpdateState">Please select an image</b-form-invalid-feedback>

        </b-form-group>

      </form>
    </b-modal>
  </div>
</template>

<script>
import {
  getBooks,
  getBooksByAuthor,
  deleteBook,
  getBook,
  getBooksByImage,
  getBooksByReleaseDate,
  postBook,
  putBook
} from '../services/books';
export default {
  data() {
    return {
      slide: 0,
      sliding: null,
      libroCreate: {
        name: "",
        author: "",
        date: "",
        image: null,
      },
      nameCreateState: null,
      authorCreateState: null,
      dateCreateState: null,
      imageCreateState: null,
      libroUpdateId: 0,
      libroUpdateName: "",
      libroUpdateAuthor: "",
      libroUpdateDate: null,
      libroUpdateImage: null,
      nameUpdateState: null,
      authorUpdateState: null,
      dateUpdateState: null,
      imageUpdateState: null,
      libros: [
        {
          id: 1,
          titulo: "El principito",
          autor: "Antoine de Saint-Exupéry",
          fecha: "1943",
          imagen: "https://picsum.photos/1024/480/?image=52",
        },
        {
          id: 2,
          titulo: "El principito",
          autor: "Antoine de Saint-Exupéry",
          fecha: "1943",
          imagen: "https://picsum.photos/1024/480/?image=54",
        },
        {
          id: 3,
          titulo: "El principito",
          autor: "Antoine de Saint-Exupéry",
          fecha: "1943",
          imagen: "https://picsum.photos/1024/480/?image=58",
        },
        {
          id: 4,
          titulo: "El principito",
          autor: "Antoine de Saint-Exupéry",
          fecha: "1943",
          imagen: "https://picsum.photos/1024/480/?image=55",
        },
      ],
    };
  },
  mounted() {
    this.getBooks();
  },
  methods: {
    async getBooks() {
      const response = await getBooks();
      this.libros = this.mapBooks(response.data);
    },
    mapBooks(books) {
      return books.map((book) => {
        return {
          id: book.idBook,
          titulo: book.name,
          author: book.author,
          fecha: book.releaseDate,
          imagen: book.image,
        };
      });
    },
    async deleteBookById(idBook) {
      try {
        console.log(idBook)
        const response = await deleteBook(idBook)
        console.log(response.data)
        alert('Libro eliminado correctamente')
        this.getBooks()
      } catch (error) {
        console.error(error)
      }
    },
    handleSubmit(event) {
      event.preventDefault();
    },
    async saveBook() {
      try {
        console.log(this.libroCreate)
        const libro = {
          name: this.libroCreate.name,
          author: this.libroCreate.author,
          releaseDate: this.libroCreate.date,
          image: this.libroCreate.image
        }
        console.log(libro)
        const response = await postBook(libro)
        console.log(response.data)
        alert('Libro creado correctamente')
        this.getBooks()
      } catch (error) {
        console.error(error)
      }
    },
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
    createBook() {
      if (this.$refs["form"].checkValidity()) {
        this.saveBook();
        this.$refs["modal-create"].hide();
      } else {
        this.nameCreateState = this.$refs["form"].nameCreateState;
        this.authorCreateState = this.$refs["form"].authorCreateState;
        this.dateCreateState = this.$refs["form"].dateCreateState;
        this.imageCreateState = this.$refs["form"].imageCreateState;
      }
    },
    updateBook() {
      //mostrar modal v-b-modal.modal-create
      this.getBook(this.idBook);
      this.$refs["modal-prevent-closing"].show();
    },
    dropBook(id) {
      //Eliminar libro
      console.log("Eliminar libro");
      this.deleteBookById(id);
    },
    resetModal() {
      this.libroCreate = {
        name: "",
        author: "",
        date: "",
        image: null,
      };
      this.nameCreateState = null;
      this.authorCreateState = null;
      this.dateCreateState = null;
      this.imageCreateState = null;
    },

    dateFormat(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate() + 1).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    mapBooks(books) {
      return books.map((book) => {
        return {
          id: book.idBook,
          titulo: book.name,
          autor: book.author,
          fecha: book.releaseDate,
          imagen: book.image,
        };
      });
    },

    setBook(book) {
      this.libroUpdateId = book.idBook;
      this.libroUpdateName = book.name;
      this.libroUpdateAuthor = book.author;
      this.libroUpdateDate = this.dateFormat(new Date(book.releaseDate));
      this.libroUpdateImage = book.image;
    },

    prepareBookToUpdate() {
      return {
        idBook: this.libroUpdateId,
        name: this.libroUpdateName,
        author: this.libroUpdateAuthor,
        releaseDate: this.libroUpdateDate,
        image: this.libroUpdateImage,
      };
    },

    //api methods
    async getBook(id) {
      const response = await getBook(id);
      this.setBook(response.data);
      console.log(response.data);
    },

    async getBooks() {
      const response = await getBooks();
      this.libros = this.mapBooks(response.data);
    },

    async getBooksByAuthor() {
      const response = await getBooksByAuthor();
      this.libros = this.mapBooks(response.data);
    },

    async getBooksByImage() {
      const response = await getBooksByImage();
      this.libros = this.mapBooks(response.data);
    },

    async getBooksByReleaseDate() {
      const response = await getBooksByReleaseDate();
      this.libros = this.mapBooks(response.data);
    },

    async putBook(id, book) {
      const response = await putBook(id, book);
      this.getBooks();
    },

    async handleOk() {
      console.log("Submit");
      const book = this.prepareBookToUpdate();
      await this.putBook(this.libroUpdateId, book);
      this.$refs["modal-prevent-closing"].hide();
    },

    onDrop(event) {
      console.log("Soltado");
      console.log(event);
      this.updateBook();
    },
    onDropDelete(event) {
      console.log("Soltado");
      console.log(event);
      const itemId = event.dataTransfer.getData("itemID");
      console.log(itemId);
      this.dropBook(itemId);
    },
    startDrag(event, libro) {
      console.log("Arrastre iniciado");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", libro.id);
    },
    startDrag(event, id) {
      console.log("Drag started");
      console.log(event);
      this.idBook = id;
    },
  },
  mounted() {
    this.getBooks();
  },
};
</script>

<style>
#about {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-self: start;
  justify-content: space-between;
  background-color: #6991ba;
  width: 100%;
  height: 100%;
  font-style: italic;
  color: #000000;
}
</style>