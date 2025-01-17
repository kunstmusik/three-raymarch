/**
 * @ignore
 */
export const lights_fragment_begin = `
GeometricContext geometry;
vec3 mvPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
geometry.position = mvPosition;
geometry.normal = normal;
geometry.viewDir = normalize(-mvPosition.xyz);

IncidentLight directLight;

#if (NUM_POINT_LIGHTS > 0) && defined(RE_Direct)
PointLight pointLight;
#pragma unroll_loop_start
for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
  pointLight = pointLights[ i ];
  getPointLightInfo(pointLight, geometry, directLight);
  #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS)
  directLight.color *= all(bvec3( pointLight.shadow, directLight.visible, receiveShadow)) ? getPointShadow(pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar) : 1.0;
  #endif
  RE_Direct( directLight, geometry, material, reflectedLight );
}
#pragma unroll_loop_end
#endif

#if (NUM_SPOT_LIGHTS > 0) && defined(RE_Direct)
SpotLight spotLight;
#pragma unroll_loop_start
for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
  spotLight = spotLights[ i ];
  getSpotDirectLightIrradiance(spotLight, geometry, directLight);
  #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS)
  directLight.color *= all(bvec3(spotLight.shadow, directLight.visible, receiveShadow)) ? getShadow(spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ]) : 1.0;
  #endif
  RE_Direct(directLight, geometry, material, reflectedLight);
}
#pragma unroll_loop_end
#endif


#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
DirectionalLight directionalLight;
#pragma unroll_loop_start
for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
  directionalLight = directionalLights[ i ];
  getDirectionalLightInfo( directionalLight, geometry, directLight );
  #if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
  directLight.color *= all( bvec3( directionalLight.shadow, directLight.visible, receiveShadow ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
  #endif
  RE_Direct( directLight, geometry, material, reflectedLight );
}
#pragma unroll_loop_end
#endif

#if (NUM_RECT_AREA_LIGHTS > 0) && defined(RE_Direct_RectArea)
RectAreaLight rectAreaLight;
#pragma unroll_loop_start
for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
  rectAreaLight = rectAreaLights[ i ];
  RE_Direct_RectArea(rectAreaLight, geometry, material, reflectedLight);
}
#pragma unroll_loop_end
#endif


#if defined( RE_IndirectDiffuse )
vec3 iblIrradiance = vec3(0.0);
vec3 irradiance = getAmbientLightIrradiance(ambientLightColor);
irradiance += getLightProbeIrradiance(lightProbe, geometry.normal);
#if (NUM_HEMI_LIGHTS > 0)
#pragma unroll_loop_start
for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
  irradiance += getHemisphereLightIrradiance(hemisphereLights[ i ], geometry);
}
#pragma unroll_loop_end
#endif
#endif

#if defined( RE_IndirectSpecular )
vec3 radiance = vec3(0.0);
vec3 clearcoatRadiance = vec3(0.0);
#endif
`;