<template>
    <v-container>
        <vue-json-editor v-model="json" :show-btns="true" :expandedOnStart="true" @json-change="onJsonChange"></vue-json-editor>
    </v-container>
</template> 
<script>
export default {
    data() {
        return {
            json: JSON.stringify({key: 'value'})
        }
    }
}
</script>