
// Vertex Shader
export const vs = `
  uniform float time;
  uniform float pointSize;
  uniform vec4 inputData;
  uniform vec4 outputData;
  
  varying float vDisplacement;

  // Perlin 3D Noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    // --- Displacement Calculation ---
    float baseNoise = snoise(position * 2.0 + time * 0.1);
    float detailNoise = snoise(position * 8.0 + time * 0.5);
    float ambientDisplacement = baseNoise * 0.15 + detailNoise * 0.04;
    
    // More impactful audio reaction
    float inputPulse = inputData.x * 1.5;
    float inputTexture = inputData.y * snoise(position * 4.0 + time * 2.0);
    float inputDisplacement = (inputPulse + inputTexture) * 0.5;

    float outputPulse = outputData.x * 2.0;
    float outputTexture = outputData.z * snoise(position * 5.0 - time * 3.0);
    float outputDisplacement = (outputPulse + outputTexture) * 0.8;
    
    float totalDisplacement = ambientDisplacement + inputDisplacement + outputDisplacement;
    vDisplacement = totalDisplacement; // Pass displacement to fragment shader

    vec3 displacedPosition = position + normal * totalDisplacement;
    
    // --- Final Position ---
    vec4 modelPosition = modelMatrix * vec4(displacedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = pointSize * (3.0 / -viewPosition.z);
  }
`;

// Fragment Shader
export const fs = `
  uniform float time;
  uniform vec4 inputData;
  uniform vec4 outputData;
  
  varying float vDisplacement;

  // IQ's color palette function
  vec3 palette( float t ) {
      vec3 a = vec3(0.5, 0.5, 0.5);
      vec3 b = vec3(0.5, 0.5, 0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.3, 0.4, 0.55);
      return a + b*cos( 6.28318*(c*t+d) );
  }

  void main() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    if (strength > 0.5) discard; // Make points circular
    strength = 1.0 - smoothstep(0.0, 0.5, strength);

    // Dynamic color based on displacement and time for an aurora effect
    float audioLevel = max(inputData.x, outputData.x);
    vec3 finalColor = palette( vDisplacement * 2.0 + time * 0.1 + audioLevel * 2.0);

    // When BEEP is speaking, shift color towards an electric blue
    vec3 speakingColor = vec3(0.2, 0.8, 1.0);
    float speakingMix = smoothstep(0.05, 0.3, outputData.x);
    finalColor = mix(finalColor, speakingColor, speakingMix);

    // When user is speaking, shift color towards a warmer green/yellow
    vec3 listeningColor = vec3(0.6, 1.0, 0.2);
    float listeningMix = smoothstep(0.05, 0.3, inputData.x);
    finalColor = mix(finalColor, listeningColor, listeningMix);

    gl_FragColor = vec4(finalColor, strength * 1.5);
  }
`;
