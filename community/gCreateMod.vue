<template>
    <div class="modal fade" id="create-group-mod" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Create new group</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <label for="group-name" class="col-form-label">Group Name:</label>
                            <input type="text" :class="['form-control', {'form-error': $v.community.$error }]"
                                   id="group-name" v-model.trim="$v.community.$model" />
                            <div class="error" v-if="!$v.community.required">Community name is required</div>
                            <div class="error" v-if="!$v.community.minLength">Community name must have at least {{$v.community.$params.minLength.min}} letters.</div>
                            <div class="error" v-if="!$v.community.isUnique">This community name is already registered.</div>
                            <!--<tree-view :data="$v.community" :options="{rootObjectKey: '$v.community', maxDepth: 2}"></tree-view>-->
                        </div>
                        <div class="form-group with-ico">
                            <avatar-upload />
                        </div>
                        <div class="form-group">
                            <label for="desc-text" class="col-form-label">What can you say about the group?</label>
                            <textarea class="form-control" id="desc-text" v-model="desc"></textarea>
                        </div>
                        <div class="form-group">
                            <label class="typo__label" for="ajax">Add moderators :</label>
                            <multiselect v-model="moderators" id="ajax" label="name" track-by="account" placeholder="Type to search" :options="options" :multiple="true"
                                         :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="false"
                                         :close-on-select="false" :options-limit="300" :limit="3" :showLabels="false"
                                         :max-height="1000" :show-no-results="false" :hide-selected="true" @search-change="debounceSearch">
                                <template slot="tag" slot-scope="{ option, remove }">
                                    <span class="custom__tag"><span>{{ option.account }}</span><span class="custom__remove" @click="remove(option)">❌</span></span>
                                </template>
                                <template slot="clear" slot-scope="props">
                                    <div class="multiselect__clear" v-if="members.length" @mousedown.prevent.stop="clearAll(props.search)"></div>
                                </template>
                                <template slot="option" slot-scope="props" id="search-results">
                                    <img class="option__image" :src="props.option.avatar" />
                                    <div class="option__desc"><span class="option__title">{{ props.option.account }}</span></div>
                                </template>
                            </multiselect>
                        </div>
                        <div class="form-group">
                            <label class="typo__label" for="ajax">Add members :</label>
                            <multiselect v-model="members" id="ajax" label="name" track-by="account" placeholder="Type to search" :options="options" :multiple="true"
                                         :searchable="true" :loading="isLoading" :internal-search="false" :clear-on-select="false" :close-on-select="false" :options-limit="300" :limit="3"
                                         :max-height="1000" :show-no-results="false" :hide-selected="true" @search-change="debounceSearch" :showLabels="false">
                                <template slot="tag" slot-scope="{ option, remove }">
                                    <span class="custom__tag"><span>{{ option.account }}</span><span class="custom__remove" @click="remove(option)">❌</span></span>
                                </template>
                                <template slot="clear" slot-scope="props">
                                    <div class="multiselect__clear" v-if="members.length" @mousedown.prevent.stop="clearAll(props.search)"></div>
                                </template>
                                <template slot="option" slot-scope="props" id="search-results">
                                    <img class="option__image" :src="props.option.avatar" />
                                    <div class="option__desc"><span class="option__title">{{ props.option.account }}</span></div>
                                </template>
                            </multiselect>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="addGroup()">Add group</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { custom_json } from '../../../common/helpers/customJSON';
    import searchAcc from '../../../common/helpers/searchAcc';
    import { required, minLength, between } from 'vuelidate/lib/validators'
    import { mapGetters } from 'vuex'

    export default {
        name: 'groupCreate',
        data() {
            return {
                options: [],
                isLoading: false,
                community: '',
                desc: '',
                avatar: '',
                members: [],
                moderators: []
            }
        },
        validations: {
            community: {
                required,
                isUnique(value) {
                    if (value === '') return true
                    const response = this.allGroups.find(group => group.community == value)
                    return Boolean(!response)
                },
                minLength: minLength(4)
            },
            desc: {
                between: between(20, 30)
            }
        },
        computed: {
            ...mapGetters({
                allGroups: 'ALL_GROUPS_AVAIL'
            })
        },
        methods: {
            ...searchAcc,
            addGroup() {
                const { options, isLoading, ...essentialData } = this.$data;
                custom_json(this.community, 'create_group', essentialData).then(() => {
                    this.$toast.done(`Group ${this.community} successfully created!`)
                }).catch(e => {
                    this.$toast.error('Group can\'t be created')
                })
            },
            clearAll() {
                this.options.length = 0;
            }
        },
        created() {
        }

    }

</script>
<style scoped>
    @import '../css/svgIcons.css';
</style>

<style>

    .error {
        color: red;
        font-size: 10px;
    }

    .form-error {
        border-color: red;
    }
</style>
