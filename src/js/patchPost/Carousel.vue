<template>
    <transition name="modal">
        <div class="container" id="blogs-container">
            <div class="col-xs-12">
                <div class="page-header row">
                    <h3 class="col-sm-11">Edit your previous post</h3>
                    <button type="button" @click="$emit('close')" aria-label="Close" class="close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="carousel slide" id="myCarousel" data-ride="carousel">
                    <div class="carousel-inner">
                        <div :class="{'carousel-item': v >= 0,'active': v === 0 }" v-for="(i,v) in Math.ceil(blogs.length / 4)">
                            <ul class="thumbnails row">
                                <li class="col-sm-3" v-for="(blog,index) in blogs.slice((i - 1) * 4, i * 4)">
                                    <div class="fff">
                                        <div class="thumbnail">
                                            <a href="#"><img class="d-block w-100" :src="blog.image" alt=""></a>
                                        </div>
                                        <div class="caption">
                                            <h5>{{truncate(blog.title)}}</h5>
                                            <p>{{prettify(blog.body)}}</p>
                                            <a class="btn btn-mini" @click="editPost(blog)">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div><!-- /Slide1 -->
                    </div>

                    <nav>
                        <ul class="row justify-content-end control-box pager">
                            <li><a data-slide="prev" href="#myCarousel" class="col-sm-1"><i class="fas fa-hand-point-left"></i></a></li>
                            <li><a data-slide="next" href="#myCarousel" class=""><i class="fas fa-hand-point-right"></i></a></li>
                        </ul>
                    </nav>
                    <!-- /.control-box -->

                </div><!-- /#myCarousel -->

            </div><!-- /.col-xs-12 -->
        </div><!-- /.container -->
    </transition>
</template>
<script>
    import client from '../../../src/js/ws/wsquery.js'
    import { currentAuthUser } from '../../../src/js/Notify/SortedNotif';

    import { medInstEmbed } from '../../../src/js/helpers/videoLink'
    import { replaceURLWithImage, medInsImage } from '../../../src/js/helpers/imageHandle'
    import { medInstTable } from '../../../src/js/helpers/tableHandle'
    import { markInsideDivs, clearMDattr, isHTML } from '../../../src/js/helpers/mdInsideDiv'
    import { truncate, converter, strip, stripURL } from '../../../src/js/Notify/helpers'
    import { medInsTextAlign } from '../../../src/js/helpers/textHandle';
    var isEdit = false, oldPost;
    function setEdit(val) {
        isEdit = val
    };
    export { isEdit, setEdit, oldPost };

    export default {
        name: 'blogCarousel',
        data() {
            return {
                isLoading: false,
                blogs: null,
                truncate: truncate
            }
        },
        methods: {
            getPosts: function () {
                let that = this;
                this.isLoading = true;
                //Fetching from blockchain with method getdiscussionbyblog
                client.sendAsync('get_discussions_by_blog', { tag: "sadf", limit: 10 }).then((blogs) => {
                    that.blogs = blogs.map((blog, index) => {
                        const json = JSON.parse(blog.json_metadata);
                        return { ...blog, image: json.image ? json.image[0] : json.thumbnail ? json.thumbnail : that.postGetImages(blog.body), tags: json.tags };
                    })

                }).catch((e) => {
                    console.error(e)
                    this.isLoading = false;
                })
            },
            postGetImages: function (postBody) {
                var m,
                    urls = [],
                    str = postBody,
                    rex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g,
                    rex2 = /<img.*?src="([^">]*\/([^">]*?))".*?>/g;
                while (m = rex.exec(str)) {
                    urls.push(m[1]);
                }
                while (m = rex2.exec(str)) {
                    urls.push(m[1]);
                }
                return (urls[0]);
            },

            prettify: function (param) {
                const body = converter.makeHtml(param)
                let x = stripURL(body);
                return truncate(strip(x));
            },
            editPost: async function (blog) {
                $('#maintitle').text(blog.title)

                //Bootstrap input tags handler
                $('input[name="tags"]').tagsinput('removeAll')
                let tags = blog.tags.join(', ')
                $('input[name="tags"]').tagsinput('add', tags)
                $('.bootstrap-tagsinput>input').attr('placeholder', '')

                //label markdown=1 for md that wrapped inside divs
                oldPost = blog;

                let body;
                if (isHTML()) {
                    body = blog.body;
                } else if (!isHTML()) {
                    body = converter.makeHtml(blog.body);
                }

                clearMDattr(body);
                body = replaceURLWithImage(body);

                body = medInsImage(body);
                body = medInstTable(body);
                body = medInsTextAlign(body);
                await medInstEmbed(body).then((r) => {
                    body = r;
                })

                $('.editable').html(body)

                //Telling handler that it is an edited post
                isEdit = true;

            }
        },

        mounted: function () {
            this.getPosts()
        }
    }

</script>

<style scoped>
    /*
    *   "Responsive Moving Box Carousel"
    *   Bootstrap 3.3.0 Snippet by mubarakcc7
    */
    #myCarousel {
        right: 21px;
    }

    .thumbnail > a {
        -webkit-transition: all 150ms ease;
        -moz-transition: all 150ms ease;
        -ms-transition: all 150ms ease;
        -o-transition: all 150ms ease;
        transition: all 150ms ease;
    }

        .thumbnail > a:hover {
            -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=50)"; /* IE 8 */
            filter: alpha(opacity=50); /* IE7 */
            opacity: 0.6;
            text-decoration: none;
        }

    img.d-block.w-100 {
        height: 150px;
    }

    #blogs-container {
        margin-top: 40px;
        border-top: 0;
        background: #c4e17f;
        background-image: -webkit-linear-gradient(left,#c4e17f,#c4e17f 12.5%,#f7fdca 12.5%,#f7fdca 25%,#fecf71 25%,#fecf71 37.5%,#f0776c 37.5%,#f0776c 50%,#db9dbe 50%,#db9dbe 62.5%,#c49cde 62.5%,#c49cde 75%,#669ae1 75%,#669ae1 87.5%,#62c2e4 87.5%,#62c2e4);
        background-image: -moz-linear-gradient(left,#c4e17f,#c4e17f 12.5%,#f7fdca 12.5%,#f7fdca 25%,#fecf71 25%,#fecf71 37.5%,#f0776c 37.5%,#f0776c 50%,#db9dbe 50%,#db9dbe 62.5%,#c49cde 62.5%,#c49cde 75%,#669ae1 75%,#669ae1 87.5%,#62c2e4 87.5%,#62c2e4);
        background-image: -o-linear-gradient(left,#c4e17f,#c4e17f 12.5%,#f7fdca 12.5%,#f7fdca 25%,#fecf71 25%,#fecf71 37.5%,#f0776c 37.5%,#f0776c 50%,#db9dbe 50%,#db9dbe 62.5%,#c49cde 62.5%,#c49cde 75%,#669ae1 75%,#669ae1 87.5%,#62c2e4 87.5%,#62c2e4);
        background-image: linear-gradient(to right,#c4e17f,#c4e17f 12.5%,#f7fdca 12.5%,#f7fdca 25%,#fecf71 25%,#fecf71 37.5%,#f0776c 37.5%,#f0776c 50%,#db9dbe 50%,#db9dbe 62.5%,#c49cde 62.5%,#c49cde 75%,#669ae1 75%,#669ae1 87.5%,#62c2e4 87.5%,#62c2e4)
    }

    .thumbnails li > .fff .caption {
        background: #fff !important;
        padding: 10px;
        max-height: 300px;
    }

    /* Page Header */
    .page-header {
        background: #f9f9f9;
        margin: -30px -40px 40px;
        padding: 20px 40px;
        border-top: 4px solid #ccc;
        color: #999;
        text-transform: uppercase;
    }

        .page-header h3 {
            line-height: 0.88rem;
            color: #000;
        }

    ul.thumbnails {
        margin-bottom: 0px;
    }



    /* Thumbnail Box */
    .caption h4 {
        color: #444;
    }

    .caption p {
        color: #999;
    }



    /* Carousel Control */
    .control-box {
        text-align: right;
        width: 100%;
        font-size: 26px;
    }

    .carousel-control {
        background: #666;
        border: 0px;
        border-radius: 0px;
        display: inline-block;
        font-size: 34px;
        font-weight: 200;
        line-height: 18px;
        opacity: 0.5;
        padding: 4px 10px 0px;
        position: static;
        height: 30px;
        width: 15px;
    }



    /* Mobile Only */
    @media (max-width: 767px) {
        .page-header, .control-box {
            text-align: center;
        }
    }

    @media (max-width: 479px) {
        .caption {
            word-break: break-all;
        }
    }


    .thumbnails > li, .pager > li {
        list-style-type: none;
    }

    ::selection {
        background: #ff5e99;
        color: #FFFFFF;
        text-shadow: 0;
    }

    ::-moz-selection {
        background: #ff5e99;
        color: #FFFFFF;
    }
</style>
