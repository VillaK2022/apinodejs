<template>
    <div>

        <body v-loading.fullscreen.lock="fullscreenLoading"
            :element-loading-text="loading_msg ? loading_msg : 'Cargando...'"
            element-loading-background="rgba(0, 0, 0, 0.7)" class="light-body">
            <div id="contenedor">
                <el-card class="light-card p-1" style="max-width: 100%;">
                    <div class="row">
                        <span style="font-size: 30px; font-weight: bold;" class="mb-4">Datos de tercero</span>
                    </div>
                    <el-form :model="form" label-width="auto" style="max-width: 100%">
                        <div class="row mb-3">
                            <!-- Datos del tercero -->
                            <div class="row mb-3">
                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <!-- <el-form-item class="fw-bold" label="Nombre"> -->
                                    <span>Razón social</span>
                                    <el-input disabled style="width: 100%" v-model="form.nombre">
                                        <template v-if="!form.nombre" #suffix>
                                            <el-icon style="color: red;">
                                                <Warning />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                    <!-- </el-form-item> -->
                                </div>

                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <!-- <el-form-item class="fw-bold" label="Dirección"> -->
                                    <span>Dirección</span>
                                    <el-input style="width: 100%" v-model="form.direccion">
                                        <template v-if="!form.direccion" #suffix>
                                            <el-icon style="color: red;">
                                                <Warning />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                    <!-- </el-form-item> -->
                                </div>

                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <!-- <el-form-item class="fw-bold" label="Telefono"> -->
                                    <span>Telefono</span>
                                    <el-input @input="solonumero($event, 'telefono')" style="width: 100%"
                                        v-model="form.telefono">
                                        <template v-if="!form.telefono" #suffix>
                                            <el-icon style="color: red;">
                                                <Warning />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                    <!-- </el-form-item> -->
                                </div>

                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <span>Correo</span>
                                    <el-input style="width: 100%" v-model="form.correo" type="email"
                                        :class="{ 'error-border': form.correo && !correoinvalido(form.correo) }">
                                        <template v-if="!form.correo" #suffix>
                                            <el-icon style="color: red;">
                                                <Warning />
                                            </el-icon>
                                        </template>
                                        <template v-else-if="!correoinvalido(form.correo)" #suffix>
                                            <el-icon style="color: red;" title="Correo inválido">
                                                <CloseBold />
                                            </el-icon>
                                        </template>
                                        <template v-else #suffix>
                                            <el-icon style="color: green;" title="Correo válido">
                                                <Check />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                    <small v-if="form.correo && !correoinvalido(form.correo)"
                                        style="color: red; font-size: 12px;">
                                        Por favor ingrese un correo válido
                                    </small>
                                </div>

                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <!-- <el-form-item class="fw-bold" label="Telefono movil"> -->
                                    <span>Telefono movil</span>

                                    <el-input @input="solonumero($event, 'telefono_movil')" style="width: 100%"
                                        v-model="form.telefono_movil">
                                        <template v-if="!form.telefono_movil" #suffix>
                                            <el-icon style="color: red;">
                                                <Warning />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                    <!-- </el-form-item> -->
                                </div>
                            </div>
                            <el-divider content-position="center"></el-divider>
                            <!-- Fin datos del tercero -->


                            <!-- inicio de datos de contacto -->
                            <div class="row mb-3 mb-4">
                                <span style="font-size: 30px; font-weight: bold;" class="mb-4">Datos de contacto</span>

                            </div>
                            <div class="row mb-3">
                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <!-- <el-form-item class="fw-bold" label="Contacto"> -->
                                    <span>Contacto</span>
                                    <el-input @input="sololetra($event, 'contacto')" style="width: 100%"
                                        v-model="form.contacto">
                                        <template v-if="!form.contacto" #suffix>
                                            <el-icon style="color: red;">
                                                <Warning />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                    <!-- </el-form-item> -->
                                </div>



                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <span>Correo contacto</span>
                                    <el-input style="width: 100%" v-model="form.correo_contacto" type="email"
                                        :class="{ 'error-border': form.correo_contacto && !correoinvalido(form.correo_contacto) }">
                                        <template v-if="!form.correo_contacto" #suffix>
                                            <el-icon style="color: red;">
                                                <Warning />
                                            </el-icon>
                                        </template>
                                        <template v-else-if="!correoinvalido(form.correo_contacto)" #suffix>
                                            <el-icon style="color: red;" title="Correo inválido">
                                                <CloseBold />
                                            </el-icon>
                                        </template>
                                        <template v-else #suffix>
                                            <el-icon style="color: green;" title="Correo válido">
                                                <Check />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                    <small v-if="form.correo_contacto && !correoinvalido(form.correo_contacto)"
                                        style="color: red; font-size: 12px;">
                                        Por favor ingrese un correo válido
                                    </small>
                                </div>


                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <span>Telefono Contacto</span>
                                    <!-- <el-form-item class="fw-bold" label="Telefono Contacto"> -->
                                    <el-input @input="solonumero($event, 'telefono_contacto')" style="width: 100%"
                                        v-model="form.telefono_contacto">

                                    </el-input>
                                    <!-- </el-form-item> -->
                                </div>
                            </div>
                            <el-divider content-position="center"></el-divider>
                            <!-- Fin de datos del contacto -->


                            <!-- Datos en orden de compra -->
                            <div class="row mb-3 mt-4 mb-4">
                                <span style="font-size: 30px; font-weight: bold;" class="mb-4">Información adicional de
                                    vendedores por
                                    proveedor</span>
                            </div>
                            <div class="row mb-3">

                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <span>Correo vendedor</span>
                                    <el-input style="width: 100%" v-model="form.correo_vendedor" type="email"
                                        :class="{ 'error-border': form.correo_vendedor && !correoinvalido(form.correo_vendedor) }">
                                        <template v-if="!form.correo_vendedor" #suffix>
                                            <el-icon style="color: red;">
                                                <Warning />
                                            </el-icon>
                                        </template>
                                        <template v-else-if="!correoinvalido(form.correo_vendedor)" #suffix>
                                            <el-icon style="color: red;" title="Correo inválido">
                                                <CloseBold />
                                            </el-icon>
                                        </template>
                                        <template v-else #suffix>
                                            <el-icon style="color: green;" title="Correo válido">
                                                <Check />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                    <small v-if="form.correo_vendedor && !correoinvalido(form.correo_vendedor)"
                                        style="color: red; font-size: 12px;">
                                        Por favor ingrese un correo válido
                                    </small>
                                </div>

                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <span>Vendedor</span>
                                    <el-input @input="sololetra($event, 'vendedor')" style="width: 100%"
                                        v-model="form.vendedor">
                                        <template v-if="!form.vendedor" #suffix>
                                            <el-icon style="color: red;">
                                                <Warning />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </div>

                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <span>Telefono Vendedor</span>
                                    <el-input @input="solonumero($event, 'telefono_vendedor')" style="width: 100%"
                                        v-model="form.telefono_vendedor">
                                        <template v-if="!form.telefono_vendedor" #suffix>
                                            <el-icon style="color: red;">
                                                <Warning />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </div>

                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <span>Día de pedido</span>
                                    <el-select v-model="form.dia_pedido" placeholder="Día">
                                        <el-option v-for="item in dias_pedido" :key="item.value" :label="item.label"
                                            :value="item.value">
                                            <template v-if="!form.dia_pedido" #suffix>
                                                <el-icon style="color: red;">
                                                    <Warning />
                                                </el-icon>
                                            </template>
                                        </el-option>
                                    </el-select>
                                </div>

                                <div class="col-lg-4 col-md-3 col-sm-12 mb-4">
                                    <span>Frecuencia de despacho &nbsp;&nbsp; &nbsp; &nbsp;</span>
                                    <el-select v-model="form.fre_despacho" placeholder="Vacio">
                                        <el-option v-for="item in frecuencia" :key="item.value" :label="item.label"
                                            :value="item.value">
                                            <template v-if="!form.fre_despacho" #suffix>
                                                <el-icon style="color: red;">
                                                    <Warning />
                                                </el-icon>
                                            </template>
                                        </el-option>
                                    </el-select>
                                </div>
                                <!-- <div class="col-lg-4 col-md-3 col-sm-12 mb-4"></div> -->
                            </div>
                            <el-divider content-position="center"></el-divider>
                            <!-- Fin datos en orden de compra -->


                            <!-- Datos comerciales -->
                            <div class="row mt-4 mb-4">
                                <span style="font-size: 30px; font-weight: bold;" class="mb-4">Datos comerciales</span>
                            </div>
                            <div class="row mb-3">
                                <div class="col-lg-12 card p-3">
                                    <div class="table-title">Contactos Empresariales</div>
                                    <div class="col-lg-12">
                                        <div class="table-responsive card"
                                            style="padding: 0 !important; max-height: 45vh !important; font-size: 11px !important;">

                                            <table class="table table-sm table-hover mb-0" id="contact-table">
                                                <thead>
                                                    <tr style="position: sticky; top: 0;">
                                                        <th
                                                            style="background-color:rgba(0, 152, 131, 1) ; text-wrap: nowrap; color: white; font-size: x-small;  width: 180px;">
                                                            Cargo</th>
                                                        <th style="background-color:rgba(0, 152, 131, 1) ; text-wrap: nowrap; color: white; font-size: x-small; "
                                                            class="text-center">Nombres y apellidos</th>
                                                        <th style="background-color:rgba(0, 152, 131, 1) ; text-wrap: nowrap; color: white; font-size: x-small; "
                                                            class="text-center">Email</th>
                                                        <th style="background-color:rgba(0, 152, 131, 1) ; text-wrap: nowrap; color: white; font-size: x-small; "
                                                            class="text-center">Teléfono</th>
                                                        <th style="background-color:rgba(0, 152, 131, 1) ; text-wrap: nowrap; color: white; font-size: x-small; "
                                                            class="text-center">Celular</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>Representante</th>
                                                        <td style="text-wrap: nowrap;">
                                                            <el-input style="width: 240px;"
                                                                @input="sololetra($event, 'nombre_representante')"
                                                                v-model="form.nombre_representante"
                                                                placeholder="Nombre completo"></el-input>
                                                        </td>
                                                        <td style="text-wrap: nowrap;">
                                                            <el-input style="width: 240px;"
                                                                placeholder="correo@ejemplo.com"
                                                                v-model="form.email_representante" type="email"
                                                                :class="{ 'error-border': form.email_representante && !correoinvalido(form.email_representante) }">
                                                                <template v-if="!form.email_representante" #suffix>

                                                                </template>
                                                                <template
                                                                    v-else-if="!correoinvalido(form.email_representante)"
                                                                    #suffix>
                                                                    <el-icon style="color: red;"
                                                                        title="Correo inválido">
                                                                        <CloseBold />
                                                                    </el-icon>
                                                                </template>
                                                                <template v-else #suffix>
                                                                    <el-icon style="color: green;"
                                                                        title="Correo válido">
                                                                        <Check />
                                                                    </el-icon>
                                                                </template>
                                                            </el-input>
                                                            <small
                                                                v-if="form.email_representante && !correoinvalido(form.email_representante)"
                                                                style="color: red; font-size: 12px;">
                                                                Por favor ingrese un correo válido
                                                            </small>
                                                        </td>
                                                        <td style="text-wrap: nowrap;">
                                                            <el-input style="width: 240px;"
                                                                @input="solonumero($event, 'telefono_representante')"
                                                                v-model="form.telefono_representante"
                                                                placeholder="(0000) 0000000"></el-input>
                                                        </td>
                                                        <td style="text-wrap: nowrap;">
                                                            <el-input style="width: 240px;"
                                                                @input="solonumero($event, 'celular_representante')"
                                                                v-model="form.celular_representante"
                                                                placeholder="(0000) 0000000"></el-input>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Administrador</th>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                @input="sololetra($event, 'nombre_admin')"
                                                                v-model="form.nombre_admin"
                                                                placeholder="Nombre completo"></el-input>
                                                        </td>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                placeholder="correo@ejemplo.com"
                                                                v-model="form.email_admin" type="email"
                                                                :class="{ 'error-border': form.email_admin && !correoinvalido(form.email_admin) }">
                                                                <template v-if="!form.email_admin" #suffix>

                                                                </template>
                                                                <template v-else-if="!correoinvalido(form.email_admin)"
                                                                    #suffix>
                                                                    <el-icon style="color: red;"
                                                                        title="Correo inválido">
                                                                        <CloseBold />
                                                                    </el-icon>
                                                                </template>
                                                                <template v-else #suffix>
                                                                    <el-icon style="color: green;"
                                                                        title="Correo válido">
                                                                        <Check />
                                                                    </el-icon>
                                                                </template>
                                                            </el-input>
                                                            <small
                                                                v-if="form.email_admin && !correoinvalido(form.email_admin)"
                                                                style="color: red; font-size: 12px;">
                                                                Por favor ingrese un correo válido
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                @input="solonumero($event, 'telefono_admin')"
                                                                v-model="form.telefono_admin"
                                                                placeholder="(0000) 0000000"></el-input>
                                                        </td>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                @input="solonumero($event, 'celular_admin')"
                                                                v-model="form.celular_admin"
                                                                placeholder="(0000) 0000000"></el-input>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Gerente de ventas</th>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                @input="sololetra($event, 'nombre_gerente_ventas')"
                                                                v-model="form.nombre_gerente_ventas"
                                                                placeholder="Nombre completo"></el-input>
                                                        </td>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                placeholder="correo@ejemplo.com"
                                                                v-model="form.email_gerente_ventas" type="email"
                                                                :class="{ 'error-border': form.email_gerente_ventas && !correoinvalido(form.email_gerente_ventas) }">
                                                                <template v-if="!form.email_gerente_ventas" #suffix>

                                                                </template>
                                                                <template
                                                                    v-else-if="!correoinvalido(form.email_gerente_ventas)"
                                                                    #suffix>
                                                                    <el-icon style="color: red;"
                                                                        title="Correo inválido">
                                                                        <CloseBold />
                                                                    </el-icon>
                                                                </template>
                                                                <template v-else #suffix>
                                                                    <el-icon style="color: green;"
                                                                        title="Correo válido">
                                                                        <Check />
                                                                    </el-icon>
                                                                </template>
                                                            </el-input>
                                                            <small
                                                                v-if="form.email_gerente_ventas && !correoinvalido(form.email_gerente_ventas)"
                                                                style="color: red; font-size: 12px;">
                                                                Por favor ingrese un correo válido
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                @input="solonumero($event, 'telefono_gerente_ventas')"
                                                                v-model="form.telefono_gerente_ventas"
                                                                placeholder="(0000) 0000000"></el-input>
                                                        </td>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                @input="solonumero($event, 'celular_gerente_ventas')"
                                                                v-model="form.celular_gerente_ventas"
                                                                placeholder="(0000) 0000000"></el-input>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Gerente regional</th>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                @input="sololetra($event, 'nombre_gerente_regional')"
                                                                v-model="form.nombre_gerente_regional"
                                                                placeholder="Nombre completo"></el-input>
                                                        </td>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                placeholder="correo@ejemplo.com"
                                                                v-model="form.email_gerente_regional" type="email"
                                                                :class="{ 'error-border': form.email_gerente_regional && !correoinvalido(form.email_gerente_regional) }">
                                                                <template v-if="!form.email_gerente_regional" #suffix>

                                                                </template>
                                                                <template
                                                                    v-else-if="!correoinvalido(form.email_gerente_regional)"
                                                                    #suffix>
                                                                    <el-icon style="color: red;"
                                                                        title="Correo inválido">
                                                                        <CloseBold />
                                                                    </el-icon>
                                                                </template>
                                                                <template v-else #suffix>
                                                                    <el-icon style="color: green;"
                                                                        title="Correo válido">
                                                                        <Check />
                                                                    </el-icon>
                                                                </template>
                                                            </el-input>
                                                            <small
                                                                v-if="form.email_gerente_regional && !correoinvalido(form.email_gerente_regional)"
                                                                style="color: red; font-size: 12px;">
                                                                Por favor ingrese un correo válido
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                @input="solonumero($event, 'telefono_gerente_regional')"
                                                                v-model="form.telefono_gerente_regional"
                                                                placeholder="(0000) 0000000"></el-input>
                                                        </td>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                @input="solonumero($event, 'celular_gerente_regional')"
                                                                v-model="form.celular_gerente_regional"
                                                                placeholder="(0000) 0000000"></el-input>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Vendedor</th>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                @input="sololetra($event, 'nombre_vendedor')"
                                                                v-model="form.nombre_vendedor"
                                                                placeholder="Nombre completo"></el-input>
                                                        </td>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                placeholder="correo@ejemplo.com"
                                                                v-model="form.email_vendedor" type="email"
                                                                :class="{ 'error-border': form.email_vendedor && !correoinvalido(form.email_vendedor) }">
                                                                <template v-if="!form.email_vendedor" #suffix>

                                                                </template>
                                                                <template
                                                                    v-else-if="!correoinvalido(form.email_vendedor)"
                                                                    #suffix>
                                                                    <el-icon style="color: red;"
                                                                        title="Correo inválido">
                                                                        <CloseBold />
                                                                    </el-icon>
                                                                </template>
                                                                <template v-else #suffix>
                                                                    <el-icon style="color: green;"
                                                                        title="Correo válido">
                                                                        <Check />
                                                                    </el-icon>
                                                                </template>
                                                            </el-input>
                                                            <small
                                                                v-if="form.email_vendedor && !correoinvalido(form.email_vendedor)"
                                                                style="color: red; font-size: 12px;">
                                                                Por favor ingrese un correo válido
                                                            </small>
                                                        </td>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                @input="solonumero($event, 'telefono_vendedor_comerciales')"
                                                                v-model="form.telefono_vendedor_comerciales"
                                                                placeholder="(0000) 0000000"></el-input>
                                                        </td>
                                                        <td>
                                                            <el-input style="width: 240px;"
                                                                @input="solonumero($event, 'celular_vendedor')"
                                                                v-model="form.celular_vendedor"
                                                                placeholder="(0000) 0000000"></el-input>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <span>Complete la información de contacto de los representantes
                                            empresariales</span>

                                    </div>
                                </div>
                            </div>
                            <div class="btn-group btn-group-sm mb-4" role="group" aria-label="...">
                                <el-button type="info" @click="cargartraerdatos()">Cargar datos</el-button>
                                <el-button type="danger" @click="limpiar()">Limpiar</el-button>
                                <el-button type="primary" @click="guardardatostercero">Guardar</el-button>
                            </div>
                            <div class="btn-group btn-group-sm" role="group" aria-label="...">
                                <el-button type="success" @click="abrirmodal()">Cambiar contraseña</el-button>
                            </div>

                                <!-- <el-row :gutter="20">
                                    <el-col :span="20">
                                        <el-button type="success" @click="guardardatostercero">Guardar</el-button>
                                    </el-col>
                                    <el-col :span="4" class="text-right">
                                        <el-button type="danger" @click="limpiar()">Limpiar</el-button>
                                    </el-col>
                                    <el-col :span="20" class="text-right">
                                        <el-button type="info" @click="cargartraerdatos()">Cargar datos</el-button>
                                    </el-col>
                                    <el-col :span="4" class="text-right">
                                        <el-button type="success" @click="abrirmodal()">
                                            Cambiar contraseña
                                        </el-button>
                                    </el-col>
                                </el-row> -->
                            <!-- Fin de datos comerciales -->
                        </div>
                    </el-form>
                </el-card>
            </div>
            <!-- modal contraseña -->
            <el-dialog v-model="dialogFormVisible" width="500" align-center destroy-on-close>
                <el-form :model="form">
                    <h2>Cambiar contraseña</h2>
                    <el-form-item label="Documento" :label-width="formLabelWidth">
                        <el-input disabled v-model="form.documento" />
                    </el-form-item>
                    <el-form-item label="Contraseña" :label-width="formLabelWidth">
                        <el-input v-model="form.password" autocomplete="off" placeholder="Ingresa una nueva contraseña">
                        </el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">Cancelar</el-button>
                        <el-button type="primary" @click="cambiarcontraseña()">
                            Guardar
                        </el-button>
                    </div>
                </template>
            </el-dialog>
            <!-- fin modal Contraseña -->
        </body>
    </div>
</template>
<script setup lang="ts">
///////////////////////////////////////////////////
///////////////// Import
///////////////////////////////////////////////////
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Action } from 'element-plus';
///////////////////////////////////////////////////
///////////////// VARIABLES
///////////////////////////////////////////////////
const emit = defineEmits(['change-window', 'notification', 'swal']);
const emitAsync = (event: string, ...args: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Usar emit normal pero agregando callback como último argumento
        (emit as any)(event, ...args, (response: any, error: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
    })
}
const datosinicio = JSON.parse(localStorage.getItem('userData'))
const id_tercero = datosinicio.id;
const fullscreenLoading = ref(false)
const loading_msg = ref(null)
const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const frecuencia = [
    { value: 'semanal', label: 'Semanal' },
    { value: 'mes', label: 'Mes' },
    { value: 'anual', label: 'Anual' }
];
const dias_pedido = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miercoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sabado' },
    { value: 'domingo', label: 'Domingo' }
];
const form = reactive({
    id: datosinicio.id_mproveedor,
    id_tercero: id_tercero,
    nombre: '',
    direccion: '',
    telefono: '',
    contacto: '',
    correo: '',
    telefono_contacto: '',
    telefono_movil: '',
    correo_contacto: '',
    vendedor: '',
    dia_pedido: '',
    fre_despacho: '',
    correo_vendedor: '',
    telefono_vendedor: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
    // -- email repre
    email_representante: '',
    email_admin: '',
    email_gerente_ventas: '',
    email_gerente_regional: '',
    email_vendedor: '',
    // -- nombres repre
    nombre_representante: '',
    nombre_admin: '',
    nombre_gerente_ventas: '',
    nombre_gerente_regional: '',
    nombre_vendedor: '',
    // -- celular repre
    celular_representante: '',
    celular_admin: '',
    celular_gerente_ventas: '',
    celular_gerente_regional: '',
    celular_vendedor: '',
    // -- telefono repre
    telefono_representante: '',
    telefono_admin: '',
    telefono_gerente_ventas: '',
    telefono_gerente_regional: '',
    telefono_vendedor_comerciales: '',
    password: '',
    documento: ''
})
///////////////////////////////////////////////////
///////////////// METODOS
///////////////////////////////////////////////////
const sololetra = (e, value) => {
    const oldValue = e;
    const valorLimpio = oldValue.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-]/g, '');
    if (oldValue !== valorLimpio) {
        if (form[value] !== null && form[value] !== undefined) form[value] = valorLimpio;
    }
}
const solonumero = (e, value) => {
    const oldValue = e;
    const valorLimpio = oldValue.replace(/\D/g, '');
    if (oldValue !== valorLimpio) {
        if (form[value] !== null && form[value] !== undefined) form[value] = valorLimpio;
    }
}
const traerdatos = async () => {

    if (fullscreenLoading.value) return;
    loading_msg.value = "Cargando Datos... Por favor espere";
    fullscreenLoading.value = true;

    // ------------- consultar datos del tercero ---------------------------
    try {
        const response = await axios.post(`/datos_todos`, {
            id_tercero: id_tercero
        })
        // ------------------ si no llega data ----------------------
        if (!response.data) {
            fullscreenLoading.value = false;
            emit('notification', 'No llegaron datos de la consulta', 'warning', 'Error');
            return;
        }
        // ------------- lleno los dato -------------------
        // console.log(response.data);
        form.nombre = response.data.razon_social
        form.direccion = response.data.direccion
        form.telefono = response.data.telefono
        form.telefono_movil = response.data.telefonomovil
        form.contacto = response.data.contacto
        form.correo = response.data.email
        form.correo_contacto = response.data.emailcontacto
        form.telefono_contacto = response.data.telefonocontacto
        form.vendedor = response.data.vendedor
        form.dia_pedido = response.data.dia_pedido
        form.fre_despacho = response.data.frecuencia_despacho
        form.correo_vendedor = response.data.correo_vendedor
        form.telefono_vendedor = response.data.telefono_vendedor
        form.date1 = response.data.date1
        form.date2 = response.data.date2
        form.delivery = response.data.delivery
        form.type = response.data.type
        form.resource = response.data.resource
        form.desc = response.data.desc

        // datos de la tabla
        form.email_representante = response.data.email_representante1
        form.email_admin = response.data.email_representante2
        form.email_gerente_ventas = response.data.email_representante3
        form.email_gerente_regional = response.data.email_representante4
        form.email_vendedor = response.data.email_representante5

        form.nombre_representante = response.data.representante1
        form.nombre_admin = response.data.representante2
        form.nombre_gerente_ventas = response.data.representante3
        form.nombre_gerente_regional = response.data.representante4
        form.nombre_vendedor = response.data.representante5

        form.telefono_representante = response.data.telefono_representante1
        form.telefono_admin = response.data.telefono_representante2
        form.telefono_gerente_ventas = response.data.telefono_representante3
        form.telefono_gerente_regional = response.data.telefono_representante4
        form.telefono_vendedor_comerciales = response.data.telefono_representante5

        form.celular_representante = response.data.celular_representante1
        form.celular_admin = response.data.celular_representante2
        form.celular_gerente_ventas = response.data.celular_representante3
        form.celular_gerente_regional = response.data.celular_representante4
        form.celular_vendedor = response.data.celular_representante5

        form.documento = response.data.ci2
        // -------------- quitar loading --------------------
        loading_msg.value = null;
        fullscreenLoading.value = false;
        // -------------- fin de los datos --------------------
    } catch (error) {
        console.error("Error al cargar la data", error);
        fullscreenLoading.value = false;
        emit('notification', 'No se pudieron cargar los datos', 'warning', 'Error');
    }
}
const cargartraerdatos = async () => {
    console.log(form.id);

    ElMessageBox.confirm(
        '¿Seguro quieres cargar datos?',
        'Confirmar',
        {
            distinguishCancelAndClose: true,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
        }
    )
        .then(async () => {
            if (fullscreenLoading.value) return;
            loading_msg.value = "Cargando Datos... Por favor espere";
            fullscreenLoading.value = true;

            // ------------- consultar datos del tercero ---------------------------
            try {
                const response = await axios.post(`/datos_todos`, {
                    id_tercero: id_tercero
                })
                // ------------------ si no llega data ----------------------
                if (!response.data) {
                    emit('notification', 'No llegaron datos de la consulta', 'warning', 'Error');
                    fullscreenLoading.value = false;
                    return;
                }
                // ------------- lleno los dato -------------------
                // console.log(response.data);
                form.nombre = response.data.razon_social
                form.direccion = response.data.direccion
                form.telefono = response.data.telefono
                form.telefono_movil = response.data.telefonomovil
                form.contacto = response.data.contacto
                form.correo = response.data.email
                form.correo_contacto = response.data.emailcontacto
                form.telefono_contacto = response.data.telefonocontacto
                form.vendedor = response.data.vendedor
                form.dia_pedido = response.data.dia_pedido
                form.fre_despacho = response.data.frecuencia_despacho
                form.correo_vendedor = response.data.correo_vendedor
                form.telefono_vendedor = response.data.telefono_vendedor
                form.date1 = response.data.date1
                form.date2 = response.data.date2
                form.delivery = response.data.delivery
                form.type = response.data.type
                form.resource = response.data.resource
                form.desc = response.data.desc

                // datos de la tabla
                form.email_representante = response.data.email_representante1
                form.email_admin = response.data.email_representante2
                form.email_gerente_ventas = response.data.email_representante3
                form.email_gerente_regional = response.data.email_representante4
                form.email_vendedor = response.data.email_representante5

                form.nombre_representante = response.data.representante1
                form.nombre_admin = response.data.representante2
                form.nombre_gerente_ventas = response.data.representante3
                form.nombre_gerente_regional = response.data.representante4
                form.nombre_vendedor = response.data.representante5

                form.telefono_representante = response.data.telefono_representante1
                form.telefono_admin = response.data.telefono_representante2
                form.telefono_gerente_ventas = response.data.telefono_representante3
                form.telefono_gerente_regional = response.data.telefono_representante4
                form.telefono_vendedor_comerciales = response.data.telefono_representante5

                form.celular_representante = response.data.celular_representante1
                form.celular_admin = response.data.celular_representante2
                form.celular_gerente_ventas = response.data.celular_representante3
                form.celular_gerente_regional = response.data.celular_representante4
                form.celular_vendedor = response.data.celular_representante5
                form.password = response.data.password
                form.documento = response.data.ci2

                // -------------- quitar loading --------------------
                loading_msg.value = null;
                fullscreenLoading.value = false;
                // -------------- fin de los datos --------------------
            } catch (error) {
                console.error("Error al cargar la data", error);
                fullscreenLoading.value = false;
                emit('notification', 'No se pudieron cargar los datos', 'warning', 'Error');
            }
            emit('notification', 'Datos cargados con exito.', 'success', 'Exito')

        })
        .catch((action: Action) => {
            ElMessage({
                type: 'info',
                message:
                    action === 'cancel'
                        ? 'No se cargaron los datos nuevamente.'
                        : 'Acción no realizada',
            })
        })

}
const guardardatostercero = async () => {
    if (fullscreenLoading.value) return;
    loading_msg.value = "Cargando Datos... Por favor espere";
    fullscreenLoading.value = true;
    // VALIDACIONES CAMPOS OBLIGATORIOS
    let error_form = [];
    if (!form.nombre) error_form.push("Nombre");
    if (!form.direccion) error_form.push("Dirección");
    if (!form.telefono) error_form.push("Telefono");
    if (!form.correo) error_form.push("Correo");
    if (!form.telefono_movil) error_form.push("Telefono movil");
    if (!form.contacto) error_form.push("Contacto");
    if (!form.correo_contacto) error_form.push("Correo de contacto");
    if (!form.correo_vendedor) error_form.push("Correo de vendedor");
    if (!form.vendedor) error_form.push("Vendedor");
    if (!form.telefono_vendedor) error_form.push("Telefono vendedor");
    if (!form.dia_pedido) error_form.push("Dia de pedido");
    if (!form.fre_despacho) error_form.push("Frecuencia");
    if (error_form.length > 0) {
        fullscreenLoading.value = false;
        const msg = error_form.length == 1 ? 'Falta el campo (' + error_form.join(", ") + ")" : 'Faltan los campos (' + error_form.join(", ") + ")";
        emit('notification', msg, 'info', 'Datos faltantes');
        return;
    }
    // VALIDACION DE CORREOS
    let error_correos = [];
    if (form.correo && !correoinvalido(form.correo)) error_correos.push("correo principal");
    if (form.correo_contacto && !correoinvalido(form.correo_contacto)) error_correos.push("correo del contacto");
    if (form.correo_vendedor && !correoinvalido(form.correo_vendedor)) error_correos.push("correo del vendedor");
    // DATOS COMERCIALES
    if (form.email_representante && !correoinvalido(form.email_representante)) error_correos.push("correo del representante comercial");
    if (form.email_admin && !correoinvalido(form.email_admin)) error_correos.push("correo del administrador comercial");
    if (form.email_gerente_ventas && !correoinvalido(form.email_gerente_ventas)) error_correos.push("correo del gerente de ventas comercial");
    if (form.email_gerente_regional && !correoinvalido(form.email_gerente_regional)) error_correos.push("correo del gerente regional comercial");
    if (form.email_vendedor && !correoinvalido(form.email_vendedor)) error_correos.push("correo del vendedor comercial");
    if (error_correos.length > 0) {
        emit('notification', 'Corregir ' + error_correos.join(', '), 'warning', "Correo Invalido");
        fullscreenLoading.value = false;
        return;
    }
    try {
        const value = { ...form };
        await axios.post(`/actualizardatostercero`, value);
        fullscreenLoading.value = false
        await emitAsync('swal', '', 'success', 'Guardado con exitoso!');
        emit('change-window');
        window.location.reload();
    } catch (error) {
        console.error('Error al guardar datos de 3ro:', error)
        // El servidor respondió con un código de error
        if (error.response && error.response.status === 300) {
            fullscreenLoading.value = false;
            let msg = (error.response.data?.message || 'Error al obtener los datos')
            emit('notification', msg, 'info', 'Error');
        } else if (error.response && error.response.status === 500) {
            let msg = 'Intenta nuevamente en unos minutos'
            emit('notification', msg, 'warning', 'Datos faltantes');
        } else {
            fullscreenLoading.value = false
            let msg = error.response.data?.message || 'Error en guardar los cambios'
            emit('notification', msg, 'warning', 'Error');
        }
    }
}
const correoinvalido = (email) => {
    // Expresión regular para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
const limpiar = () => {
    // form.nombre = '',
    form.direccion = '',
        form.telefono = '',
        form.contacto = '',
        form.correo = '',
        form.telefono_contacto = '',
        form.telefono_movil = '',
        form.correo_contacto = '',
        form.vendedor = '',
        form.dia_pedido = '',
        form.fre_despacho = '',
        form.correo_vendedor = '',
        form.telefono_vendedor = '',
        form.date1 = '',
        form.date2 = '',
        form.delivery = false,
        form.type = [],
        form.resource = '',
        form.desc = '',
        form.email_representante = '',
        form.email_admin = '',
        form.email_gerente_ventas = '',
        form.email_gerente_regional = '',
        form.email_vendedor = '',

        form.nombre_representante = '',
        form.nombre_admin = '',
        form.nombre_gerente_ventas = '',
        form.nombre_gerente_regional = '',
        form.nombre_vendedor = '',

        form.celular_representante = '',
        form.celular_admin = '',
        form.celular_gerente_ventas = '',
        form.celular_gerente_regional = '',
        form.celular_vendedor = '',

        form.telefono_representante = '',
        form.telefono_admin = '',
        form.telefono_gerente_ventas = '',
        form.telefono_gerente_regional = '',
        form.telefono_vendedor_comerciales = ''
}
const cambiarcontraseña = async () => {
    if (fullscreenLoading.value) return;
    loading_msg.value = "Cargando Datos... Por favor espere";
    fullscreenLoading.value = true;
    if (form.password && form.password.length >= 6) {

        try {
            const response = await axios.post(`/cambiarpassword`, {
                password: form.password,
                id_tercero: id_tercero
            })
            fullscreenLoading.value = false
            dialogFormVisible.value = false
            await emitAsync('swal', '', 'success', 'Guardado contraseña con exitoso!');
            window.location.reload()

        } catch (error) {
            console.error('Error al guardar datos de 3ro:', error)
            // Mostrar error más específico
            if (error.response) {
                // El servidor respondió con un código de error
                if (error.response.status === 300) {
                    dialogFormVisible.value = false
                    fullscreenLoading.value = false;
                    let msg = (error.response.data?.message || 'Error al obtener los datos');
                    emit('notification', msg, 'warning', 'Error al obtener datos');

                } else if (error.response.status === 500) {
                    dialogFormVisible.value = false
                    fullscreenLoading.value = false;
                    const msg = 'Intenta nuevamente en unos minutos'
                    emit('notification', msg, 'warning', 'Error del servidors');

                } else {
                    dialogFormVisible.value = false
                    fullscreenLoading.value = false;
                    let msg = error.response.data?.message || 'Error en la comunicación con el servidor';
                    emit('notification', msg, 'warning', 'Error');
                }
            }
            dialogFormVisible.value = false
            fullscreenLoading.value = false;
        }
        // console.log(form.password);
        dialogFormVisible.value = false
    } else {
        const msg = 'Debe ser superior a 6 digitos'
        emit('notification', msg, 'info', 'Debe ingresar una contraseña valida');
        fullscreenLoading.value = false;
        // dialogFormVisible.value = false

    }

}
const abrirmodal = () => {
    form.password = ''
    dialogFormVisible.value = true
}
const log = () => {
    emit('notification', form)
}
///////////////////////////////////////////////////
///////////////// MOUNTED
///////////////////////////////////////////////////
onMounted(() => {
    traerdatos();
});
</script>

<style scoped>
.demo-autocomplete {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
}

.demo-block {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.demo-title {
    font-size: 0.875rem;
    color: var(--el-text-color-secondary);
    min-height: 2.5em;
    display: flex;
    align-items: center;
}

@media screen and (max-width: 768px) {
    .demo-autocomplete {
        gap: 1rem;
    }

    .demo-block {
        width: 100%;
    }
}

.demo-input-with-icon {
    width: 100%;
}

.el-table ::v-deep(.el-table__footer-wrapper) .el-table__footer {
    font-size: 14px;
    background-color: red;
}

.input-group {
    margin-bottom: 1.5rem;
}

.label {
    display: block;
    margin-bottom: 1rem;
    color: var(--el-text-color-regular);
}

.input-container {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.responsive-input {
    width: 540px;
}

.el-table ::v-deep(.el-table__cell > .cell) {
    white-space: nowrap !important;
}

/* Fix for header cell content as well */
.el-table ::v-deep(.el-table__header-wrapper th > .cell) {
    white-space: nowrap !important;
}


@media (max-width: 768px) {
    .input-container {
        flex-direction: column;
        gap: 1rem;
    }

    .responsive-input {
        width: 100%;
    }
}
</style>