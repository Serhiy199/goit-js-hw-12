import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const formSearch = document.querySelector('.form');
const listGallery = document.querySelector('.gallery');
const span = document.querySelector('span');
const loadMoreBtn = document.querySelector('button[data-action="load-more"]');

const instance = axios.create({
    baseURL: 'https://pixabay.com/api/',
    params: {
        key: '41516646-ec27055f09ddd37d9bfda39a5',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
    },
});

function errorMessage(error) {
    iziToast.error({
        message: `❌ Sorry, ${error}`,
        icon: '',
        position: 'topRight',
    });
}

const getImage = async params => {
    try {
        const response = await instance.get('', { params });

        return response.data;
    } catch (error) {
        span.classList.add('visibility');

        errorMessage(error);
    }
};

const createGetImage = q => {
    let page = 1;
    let isLastPage = false;
    const perPage = 40;

    return async () => {
        try {
            if (isLastPage) return [];

            const { hits, totalHits } = await getImage({ page, q });

            loadMoreBtn.classList.remove('visibility');

            if (
                page >= Math.ceil(totalHits / perPage) &&
                Math.ceil(totalHits / perPage) !== 0
            ) {
                isLastPage = true;

                loadMoreBtn.classList.add('visibility');

                iziToast.info({
                    message:
                        "We're sorry, but you've reached the end of search results.",
                    position: 'topRight',
                });
            }

            page += 1;

            return hits;
        } catch (error) {
            span.classList.add('visibility');
            loadMoreBtn.classList.add('visibility');

            errorMessage(error);
        }
    };
};

let doFetch = null;

formSearch.addEventListener('submit', async event => {
    event.preventDefault();

    let clickOnLoad = false;

    if (doFetch != null) {
        loadMoreBtn.removeEventListener('click', doFetch);
        doFetch = null;
    }

    const data = new FormData(event.currentTarget);
    const search = data.get('search');

    const fetchImage = createGetImage(search);

    listGallery.innerHTML = '';

    doFetch = async () => {
        loadMoreBtn.classList.add('visibility');
        span.classList.remove('visibility');

        const hits = await formMarkupCreating(fetchImage());

        if (clickOnLoad) {
            const scrollToNextGroup = () => {
                const firstGalleryItem =
                    document.querySelector('.gallery-item');

                const galleryItemHeight =
                    firstGalleryItem.getBoundingClientRect().height;
                console.log(galleryItemHeight);

                window.scrollBy({
                    top: galleryItemHeight * 2,
                    behavior: 'smooth',
                });
            };
            loadMoreBtn.addEventListener('click', scrollToNextGroup());
        }

        clickOnLoad = true;

        span.classList.add('visibility');

        return clickOnLoad;
    };

    await doFetch();

    loadMoreBtn.addEventListener('click', doFetch);
});

async function formMarkupCreating(result) {
    try {
        const dataFormImage = await result;
        span.classList.remove('visibility');

        if (!dataFormImage.length) {
            iziToast.error({
                message: `❌ Sorry, there are no images matching your search query. Please, try again!`,
                icon: '',
                position: 'topRight',
            });
            span.classList.add('visibility');
            loadMoreBtn.classList.add('visibility');
            return;
        }
        const gallery = new SimpleLightbox('.gallery a', {
            captionsData: 'alt',
            captionDelay: 250,
            captionPosition: 'bottom',
        });

        const galleryMarkup = renderElement(dataFormImage);

        listGallery.insertAdjacentHTML('beforeend', galleryMarkup);

        gallery.refresh();
    } catch (error) {
        span.classList.add('visibility');
        loadMoreBtn.classList.add('visibility');
        errorMessage(error);
    }
}

function renderElement(params) {
    const render = params.reduce(
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
    return render;
}
