import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const BASE_URL = new URL('https://pixabay.com/api/');
const KEY = '41516646-ec27055f09ddd37d9bfda39a5';

const formSearch = document.querySelector('.form');
const listGallery = document.querySelector('.gallery');
const span = document.querySelector('span');

formSearch.addEventListener('submit', event => {
    event.preventDefault();
    listGallery.classList.add('visibility');
    span.classList.remove('visibility');

    const resultsSearch = event.target.elements.search.value;

    const searchParams = new URLSearchParams({
        key: KEY,
        q: resultsSearch,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
    });

    const url = `${BASE_URL}?${searchParams}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        })

        .then(result => {
            formMarkupCreating(result);
        })
        .catch(error => {
            span.classList.add('visibility');

            iziToast.error({
                message: `❌ ${error}`,

                icon: '',
                position: 'topRight',
            });
        });
});

function formMarkupCreating(result) {
    const dataFormImage = result.hits;
    if (!dataFormImage.length) {
        iziToast.error({
            message: `❌ Sorry, there are no images matching your search query. Please, try again!`,
            icon: '',
            position: 'topRight',
        });
    }
    const gallery = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
        captionPosition: 'bottom',
    });
    const galleryMarkup = dataFormImage.reduce(
        (
            html,
            {
                webformatURL,
                largeImageURL,
                tags,
                likes,
                views,
                comments,
                downloads,
            }
        ) =>
            html +
            `<li class="gallery-item">
    <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}"/>
    </a>
    <ul class="characteristics-list">
    <li class="characteristics"><span class="characteristics-titel">Likes</span> <span>${likes}</span></li>
    <li class="characteristics"><span class="characteristics-titel">Views</span> <span>${views}</span></li>
    <li class="characteristics"><span class="characteristics-titel">Comments</span> <span>${comments}</span></li>
    <li class="characteristics"><span class="characteristics-titel">Downloads</span> <span>${downloads}</span></li>
</ul>
    
</li>`,
        ''
    );

    listGallery.innerHTML = galleryMarkup;

    gallery.refresh();

    span.classList.add('visibility');
    listGallery.classList.remove('visibility');
}
