// Automated Circuit Extraction Workflow JavaScript

// Workflow data structure
const workflowData = {
    "Step 1: Field-Theoretical Analysis": {
        description: "Transform 3D geometry into electromagnetic field model and identify relevant phenomena through eigenmode analysis",
        color: "blue",
        substeps: [
            {
                id: "geometry-input",
                name: "3D Geometry Input",
                icon: "fas fa-cube",
                inputs: ["3D geometry data", "Material properties", "Boundary conditions", "Frequency range"],
                outputs: ["Meshed geometry", "Material assignments"],
                theory: "Maxwell's equations form the foundation. The 3D geometry is discretized using finite elements to create a mesh that accurately represents the physical structure.",
                description: "Import and prepare the 3D geometry for electromagnetic analysis"
            },
            {
                id: "field-simulation",
                name: "Electromagnetic Field Simulation",
                icon: "fas fa-bolt",
                inputs: ["Meshed geometry", "Excitation sources"],
                outputs: ["Electromagnetic field solution", "Field distributions"],
                theory: "Finite Element Method (FEM) or Partial Element Equivalent Circuit (PEEC) method solves Maxwell's equations to obtain the complete electromagnetic field solution.",
                description: "Compute the electromagnetic field solution using FEM or PEEC methods"
            },
            {
                id: "eigenmode-analysis",
                name: "Eigenmode Analysis",
                icon: "fas fa-chart-line",
                inputs: ["Field solution", "Frequency range"],
                outputs: ["Eigenfrequencies", "Eigenmode shapes", "Mode relevance scores"],
                theory: "Spectral theory is used to decompose the electromagnetic system into its natural resonance modes. Each mode represents a distinct electromagnetic phenomenon.",
                description: "Perform spectral decomposition to identify natural electromagnetic modes"
            },
            {
                id: "mode-selection",
                name: "Mode Selection & Filtering",
                icon: "fas fa-filter",
                inputs: ["All eigenmodes", "Relevance criteria"],
                outputs: ["Selected relevant modes", "Filtered mode set"],
                theory: "Frequency domain analysis identifies modes within the target frequency range. Mode truncation preserves only the most relevant phenomena for circuit representation.",
                description: "Filter and select eigenmodes based on frequency relevance"
            }
        ]
    },
    "Step 2: Circuit Model Construction": {
        description: "Transform reduced field model into equivalent circuit with extracted parameters and validated accuracy",
        color: "green",
        substeps: [
            {
                id: "topology-generation",
                name: "Circuit Topology Generation",
                icon: "fas fa-sitemap",
                inputs: ["Selected eigenmodes", "Mode-node mapping"],
                outputs: ["Circuit topology", "Node connections", "Branch structure"],
                theory: "Graph theory provides the mathematical framework for representing circuit topology. Each eigenmode maps to circuit nodes and branches.",
                description: "Generate circuit topology from eigenmode mapping"
            },
            {
                id: "parameter-extraction",
                name: "Parameter Extraction",
                icon: "fas fa-calculator",
                inputs: ["Field solution", "Eigenmode shapes", "Energy distributions"],
                outputs: ["R, L, C values", "Mutual couplings", "Circuit parameters"],
                theory: "Energy conservation principles map electromagnetic energy storage to circuit parameters: magnetic energy ↔ inductance, electric energy ↔ capacitance, dissipated energy ↔ resistance.",
                description: "Extract circuit parameters from electromagnetic field energy"
            },
            {
                id: "consistency-validation",
                name: "Physical Consistency Validation",
                icon: "fas fa-check-circle",
                inputs: ["Circuit model", "Field solution"],
                outputs: ["Consistency metrics", "Validation results", "Error estimates"],
                theory: "Energy conservation, passivity constraints, and reciprocity relationships ensure the circuit model represents a physically realizable system.",
                description: "Validate physical consistency of the circuit model"
            },
            {
                id: "accuracy-assessment",
                name: "Accuracy Assessment",
                icon: "fas fa-bullseye",
                inputs: ["Circuit model response", "Field model response"],
                outputs: ["Accuracy metrics", "Error analysis", "Model validation"],
                theory: "Quantitative error analysis compares circuit model response to original field solution. Convergence analysis validates model accuracy.",
                description: "Assess and quantify model accuracy and performance"
            }
        ]
    }
};

// Initialize the workflow visualization
function initializeWorkflow() {
    const container = document.getElementById('workflow-container');
    
    Object.entries(workflowData).forEach(([stepName, stepData], stepIndex) => {
        // Create main step section
        const stepSection = document.createElement('div');
        stepSection.className = `step-section bg-gradient-to-br from-${stepData.color}-50 to-${stepData.color}-100 rounded-lg p-6 mb-6`;
        
        // Step header
        const stepHeader = document.createElement('div');
        stepHeader.className = 'flex items-center justify-between mb-6';
        stepHeader.innerHTML = `
            <div class="flex items-center">
                <div class="w-12 h-12 bg-${stepData.color}-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                    ${stepIndex + 1}
                </div>
                <div>
                    <h3 class="text-2xl font-bold text-${stepData.color}-800">${stepName}</h3>
                    <p class="text-${stepData.color}-700">${stepData.description}</p>
                </div>
            </div>
            <button class="toggle-step bg-${stepData.color}-600 hover:bg-${stepData.color}-700 text-white px-4 py-2 rounded-lg transition-colors">
                <i class="fas fa-chevron-down mr-2"></i>Expand Details
            </button>
        `;
        
        // Substeps container
        const substepsContainer = document.createElement('div');
        substepsContainer.className = 'substeps-container grid grid-cols-1 md:grid-cols-2 gap-4';
        substepsContainer.style.display = 'none';
        
        // Create substeps
        stepData.substeps.forEach((substep, substepIndex) => {
            const substepElement = createSubstepElement(substep, stepData.color, substepIndex);
            substepsContainer.appendChild(substepElement);
        });
        
        stepSection.appendChild(stepHeader);
        stepSection.appendChild(substepsContainer);
        container.appendChild(stepSection);
        
        // Add toggle functionality
        const toggleButton = stepHeader.querySelector('.toggle-step');
        toggleButton.addEventListener('click', () => toggleStepDetails(stepSection, toggleButton));
    });
}

// Create individual substep element
function createSubstepElement(substep, color, index) {
    const substepDiv = document.createElement('div');
    substepDiv.className = `workflow-step bg-white rounded-lg p-4 border-2 border-${color}-200 hover:border-${color}-400 cursor-pointer`;
    substepDiv.dataset.stepId = substep.id;
    
    substepDiv.innerHTML = `
        <div class="flex items-center mb-3">
            <div class="w-8 h-8 bg-${color}-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                ${String.fromCharCode(65 + index)}
            </div>
            <i class="${substep.icon} text-${color}-600 text-xl mr-3"></i>
            <h4 class="text-lg font-semibold text-gray-800">${substep.name}</h4>
        </div>
        
        <p class="text-gray-600 text-sm mb-4">${substep.description}</p>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="input-output-panel rounded-lg p-3">
                <h5 class="text-sm font-semibold text-cyan-800 mb-2">
                    <i class="fas fa-sign-in-alt mr-1"></i>Inputs
                </h5>
                <ul class="text-xs text-cyan-700 space-y-1">
                    ${substep.inputs.map(input => `<li>• ${input}</li>`).join('')}
                </ul>
            </div>
            
            <div class="input-output-panel rounded-lg p-3">
                <h5 class="text-sm font-semibold text-cyan-800 mb-2">
                    <i class="fas fa-sign-out-alt mr-1"></i>Outputs
                </h5>
                <ul class="text-xs text-cyan-700 space-y-1">
                    ${substep.outputs.map(output => `<li>• ${output}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <button class="show-theory w-full bg-${color}-100 hover:bg-${color}-200 text-${color}-800 text-sm font-semibold py-2 px-4 rounded-lg transition-colors">
            <i class="fas fa-lightbulb mr-2"></i>Show Theory
        </button>
        
        <div class="theory-content theory-panel rounded-lg p-4 mt-3 hidden">
            <h5 class="text-sm font-semibold text-blue-800 mb-2">
                <i class="fas fa-graduation-cap mr-2"></i>Theoretical Foundation
            </h5>
            <p class="text-xs text-gray-700">${substep.theory}</p>
        </div>
    `;
    
    // Add event listener for theory toggle
    const theoryButton = substepDiv.querySelector('.show-theory');
    const theoryContent = substepDiv.querySelector('.theory-content');
    
    theoryButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTheory(theoryContent, theoryButton, color);
    });
    
    return substepDiv;
}

// Toggle step details visibility
function toggleStepDetails(stepSection, toggleButton) {
    const substepsContainer = stepSection.querySelector('.substeps-container');
    const icon = toggleButton.querySelector('i');
    
    if (substepsContainer.style.display === 'none') {
        substepsContainer.style.display = 'grid';
        icon.className = 'fas fa-chevron-up mr-2';
        toggleButton.innerHTML = '<i class="fas fa-chevron-up mr-2"></i>Collapse Details';
    } else {
        substepsContainer.style.display = 'none';
        icon.className = 'fas fa-chevron-down mr-2';
        toggleButton.innerHTML = '<i class="fas fa-chevron-down mr-2"></i>Expand Details';
    }
}

// Toggle theory content visibility
function toggleTheory(theoryContent, theoryButton, color) {
    if (theoryContent.classList.contains('hidden')) {
        theoryContent.classList.remove('hidden');
        theoryButton.innerHTML = `<i class="fas fa-lightbulb mr-2"></i>Hide Theory`;
        theoryButton.className = `show-theory w-full bg-${color}-600 hover:bg-${color}-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors`;
    } else {
        theoryContent.classList.add('hidden');
        theoryButton.innerHTML = `<i class="fas fa-lightbulb mr-2"></i>Show Theory`;
        theoryButton.className = `show-theory w-full bg-${color}-100 hover:bg-${color}-200 text-${color}-800 text-sm font-semibold py-2 px-4 rounded-lg transition-colors`;
    }
}

// Demo functionality
let demoStep = 0;
let demoRunning = false;

function initializeDemo() {
    const runButton = document.getElementById('run-demo');
    const stepButton = document.getElementById('step-demo');
    const resetButton = document.getElementById('reset-demo');
    
    runButton.addEventListener('click', runCompleteDemo);
    stepButton.addEventListener('click', stepThroughDemo);
    resetButton.addEventListener('click', resetDemo);
}

function runCompleteDemo() {
    demoRunning = true;
    demoStep = 0;
    const visualization = document.getElementById('demo-visualization');
    
    // Show progress
    visualization.innerHTML = `
        <div class="w-full">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">Running Automated Circuit Extraction...</h4>
            <div class="bg-gray-200 rounded-full h-4 mb-4">
                <div id="demo-progress" class="bg-blue-600 h-4 rounded-full transition-all duration-300" style="width: 0%"></div>
            </div>
            <p id="demo-status" class="text-sm text-gray-600">Initializing workflow...</p>
        </div>
    `;
    
    // Simulate workflow execution
    const steps = [
        { progress: 12.5, status: "Processing 3D geometry input...", delay: 800 },
        { progress: 25, status: "Running electromagnetic field simulation...", delay: 1200 },
        { progress: 37.5, status: "Performing eigenmode analysis...", delay: 1000 },
        { progress: 50, status: "Filtering relevant modes...", delay: 600 },
        { progress: 62.5, status: "Generating circuit topology...", delay: 700 },
        { progress: 75, status: "Extracting circuit parameters...", delay: 900 },
        { progress: 87.5, status: "Validating physical consistency...", delay: 500 },
        { progress: 100, status: "Circuit extraction complete!", delay: 300 }
    ];
    
    let currentStep = 0;
    
    function executeStep() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            const progressBar = document.getElementById('demo-progress');
            const statusText = document.getElementById('demo-status');
            
            progressBar.style.width = step.progress + '%';
            statusText.textContent = step.status;
            
            currentStep++;
            setTimeout(executeStep, step.delay);
        } else {
            showDemoResults();
        }
    }
    
    executeStep();
}

function stepThroughDemo() {
    const steps = [
        "3D Geometry Processing",
        "Electromagnetic Field Simulation", 
        "Eigenmode Analysis",
        "Mode Selection & Filtering",
        "Circuit Topology Generation",
        "Parameter Extraction",
        "Physical Consistency Validation",
        "Accuracy Assessment"
    ];
    
    if (demoStep < steps.length) {
        const visualization = document.getElementById('demo-visualization');
        visualization.innerHTML = `
            <div class="text-center">
                <div class="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    ${demoStep + 1}
                </div>
                <h4 class="text-lg font-semibold text-gray-800 mb-2">${steps[demoStep]}</h4>
                <p class="text-sm text-gray-600">Step ${demoStep + 1} of ${steps.length}</p>
                <div class="mt-4 bg-blue-100 rounded-lg p-3">
                    <p class="text-xs text-blue-800">Processing current step...</p>
                </div>
            </div>
        `;
        demoStep++;
    } else {
        showDemoResults();
    }
}

function showDemoResults() {
    const visualization = document.getElementById('demo-visualization');
    
    // Create a simple circuit visualization using Plotly
    const circuitData = [{
        x: [0, 1, 2, 2, 1, 0, 0],
        y: [0, 0, 0, 1, 1, 1, 0],
        mode: 'lines+markers',
        type: 'scatter',
        line: { width: 3, color: '#3B82F6' },
        marker: { size: 8, color: '#1E40AF' },
        name: 'Circuit Topology'
    }];
    
    const layout = {
        title: 'Extracted Circuit Model',
        xaxis: { title: 'X Position', showgrid: true },
        yaxis: { title: 'Y Position', showgrid: true },
        showlegend: false,
        margin: { t: 40, b: 40, l: 40, r: 40 },
        plot_bgcolor: '#F8FAFC',
        paper_bgcolor: '#FFFFFF'
    };
    
    visualization.innerHTML = '<div id="circuit-plot" style="width:100%;height:256px;"></div>';
    Plotly.newPlot('circuit-plot', circuitData, layout, {displayModeBar: false});
    
    // Add results summary
    setTimeout(() => {
        visualization.innerHTML += `
            <div class="mt-4 grid grid-cols-3 gap-4 text-center">
                <div class="bg-green-100 rounded-lg p-3">
                    <div class="text-2xl font-bold text-green-800">8</div>
                    <div class="text-xs text-green-600">Circuit Nodes</div>
                </div>
                <div class="bg-blue-100 rounded-lg p-3">
                    <div class="text-2xl font-bold text-blue-800">12</div>
                    <div class="text-xs text-blue-600">Circuit Elements</div>
                </div>
                <div class="bg-purple-100 rounded-lg p-3">
                    <div class="text-2xl font-bold text-purple-800">98.5%</div>
                    <div class="text-xs text-purple-600">Accuracy</div>
                </div>
            </div>
        `;
    }, 500);
}

function resetDemo() {
    demoStep = 0;
    demoRunning = false;
    const visualization = document.getElementById('demo-visualization');
    visualization.innerHTML = '<p class="text-gray-500">Click "Run Demo" to see the workflow in action</p>';
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeWorkflow();
    initializeDemo();
    
    // Add some initial interactivity
    const stepSections = document.querySelectorAll('.step-section');
    stepSections.forEach((section, index) => {
        setTimeout(() => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
});