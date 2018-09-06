<template>
    <div>
        <label :for="inputId" class="ms-Label" :class="styles.label">{{label}}</label>
        <div class="ms-TextField-fieldGroup" :class="styles.inputWrapper">
            <input type="text" v-model="inputValue" :id="inputId" v-on:change="_onChange" />
        </div>
    </div>
</template>
<script>
    module.exports = require('./PropertyField{ComponentName}Host');
</script>

