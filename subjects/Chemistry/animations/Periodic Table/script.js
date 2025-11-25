document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chemistryAnimations = document.getElementById('chemistryAnimations');
    const periodicTable = document.getElementById('periodicTable');
    const elementModal = document.getElementById('elementModal');
    const closeModal = document.getElementById('closeModal');
    const tableContainer = document.getElementById('tableContainer');
    const rotateLeftBtn = document.getElementById('rotateLeft');
    const rotateRightBtn = document.getElementById('rotateRight');
    const resetViewBtn = document.getElementById('resetView');
    const backToTopBtn = document.getElementById('backToTop');
    
    // State
    let currentRotation = 0;
    let currentElement = null;
    
    // Element data with proper positioning
    const elements = [
        // Period 1
        { symbol: 'H',  name: 'Hydrogen',    number: 1,  category: 'nonmetal',    row: 1, col: 1,  atomicMass: '1.008',     phase: 'Gas',    electronegativity: '2.20', electronConfig: '1s¹', density: '0.00008988' },
        { symbol: 'He', name: 'Helium',      number: 2,  category: 'noble-gas',   row: 1, col: 18, atomicMass: '4.0026',    phase: 'Gas',    electronegativity: 'N/A',  electronConfig: '1s²', density: '0.0001785' },

        // Period 2
        { symbol: 'Li', name: 'Lithium',     number: 3,  category: 'alkali-metal',      row: 2, col: 1,  atomicMass: '6.94',      phase: 'Solid', electronegativity: '0.98', electronConfig: '[He] 2s¹', density: '0.534' },
        { symbol: 'Be', name: 'Beryllium',   number: 4,  category: 'alkaline-earth',    row: 2, col: 2,  atomicMass: '9.0122',    phase: 'Solid', electronegativity: '1.57', electronConfig: '[He] 2s²', density: '1.85' },
        { symbol: 'B',  name: 'Boron',       number: 5,  category: 'metalloid',         row: 2, col: 13, atomicMass: '10.81',     phase: 'Solid', electronegativity: '2.04', electronConfig: '[He] 2s² 2p¹', density: '2.34' },
        { symbol: 'C',  name: 'Carbon',      number: 6,  category: 'nonmetal',          row: 2, col: 14, atomicMass: '12.011',    phase: 'Solid', electronegativity: '2.55', electronConfig: '[He] 2s² 2p²', density: '2.267' },
        { symbol: 'N',  name: 'Nitrogen',    number: 7,  category: 'nonmetal',          row: 2, col: 15, atomicMass: '14.007',    phase: 'Gas',   electronegativity: '3.04', electronConfig: '[He] 2s² 2p³', density: '0.0012506' },
        { symbol: 'O',  name: 'Oxygen',      number: 8,  category: 'nonmetal',          row: 2, col: 16, atomicMass: '15.999',    phase: 'Gas',   electronegativity: '3.44', electronConfig: '[He] 2s² 2p⁴', density: '0.001429' },
        { symbol: 'F',  name: 'Fluorine',    number: 9,  category: 'halogen',           row: 2, col: 17, atomicMass: '18.998',    phase: 'Gas',   electronegativity: '3.98', electronConfig: '[He] 2s² 2p⁵', density: '0.001696' },
        { symbol: 'Ne', name: 'Neon',        number: 10, category: 'noble-gas',         row: 2, col: 18, atomicMass: '20.180',    phase: 'Gas',   electronegativity: 'N/A',  electronConfig: '[He] 2s² 2p⁶', density: '0.0008999' },

        // Period 3
        { symbol: 'Na', name: 'Sodium',      number: 11, category: 'alkali-metal',      row: 3, col: 1,  atomicMass: '22.990',    phase: 'Solid', electronegativity: '0.93', electronConfig: '[Ne] 3s¹', density: '0.971' },
        { symbol: 'Mg', name: 'Magnesium',   number: 12, category: 'alkaline-earth',    row: 3, col: 2,  atomicMass: '24.305',    phase: 'Solid', electronegativity: '1.31', electronConfig: '[Ne] 3s²', density: '1.738' },
        { symbol: 'Al', name: 'Aluminum',    number: 13, category: 'post-transition',   row: 3, col: 13, atomicMass: '26.982',    phase: 'Solid', electronegativity: '1.61', electronConfig: '[Ne] 3s² 3p¹', density: '2.698' },
        { symbol: 'Si', name: 'Silicon',     number: 14, category: 'metalloid',         row: 3, col: 14, atomicMass: '28.085',    phase: 'Solid', electronegativity: '1.90', electronConfig: '[Ne] 3s² 3p²', density: '2.3296' },
        { symbol: 'P',  name: 'Phosphorus',  number: 15, category: 'nonmetal',          row: 3, col: 15, atomicMass: '30.974',    phase: 'Solid', electronegativity: '2.19', electronConfig: '[Ne] 3s² 3p³', density: '1.82' },
        { symbol: 'S',  name: 'Sulfur',      number: 16, category: 'nonmetal',          row: 3, col: 16, atomicMass: '32.06',     phase: 'Solid', electronegativity: '2.58', electronConfig: '[Ne] 3s² 3p⁴', density: '2.067' },
        { symbol: 'Cl', name: 'Chlorine',    number: 17, category: 'halogen',           row: 3, col: 17, atomicMass: '35.45',     phase: 'Gas',   electronegativity: '3.16', electronConfig: '[Ne] 3s² 3p⁵', density: '0.003214' },
        { symbol: 'Ar', name: 'Argon',       number: 18, category: 'noble-gas',         row: 3, col: 18, atomicMass: '39.948',    phase: 'Gas',   electronegativity: 'N/A',  electronConfig: '[Ne] 3s² 3p⁶', density: '0.0017837' },

        // Period 4
        { symbol: 'K',  name: 'Potassium',   number: 19, category: 'alkali-metal',      row: 4, col: 1,  atomicMass: '39.098',    phase: 'Solid', electronegativity: '0.82', electronConfig: '[Ar] 4s¹', density: '0.862' },
        { symbol: 'Ca', name: 'Calcium',     number: 20, category: 'alkaline-earth',    row: 4, col: 2,  atomicMass: '40.078',    phase: 'Solid', electronegativity: '1.00', electronConfig: '[Ar] 4s²', density: '1.54' },
        { symbol: 'Sc', name: 'Scandium',    number: 21, category: 'transition-metal',  row: 4, col: 3,  atomicMass: '44.956',    phase: 'Solid', electronegativity: '1.36', electronConfig: '[Ar] 3d¹ 4s²', density: '2.989' },
        { symbol: 'Ti', name: 'Titanium',    number: 22, category: 'transition-metal',  row: 4, col: 4,  atomicMass: '47.867',    phase: 'Solid', electronegativity: '1.54', electronConfig: '[Ar] 3d² 4s²', density: '4.54' },
        { symbol: 'V',  name: 'Vanadium',    number: 23, category: 'transition-metal',  row: 4, col: 5,  atomicMass: '50.942',    phase: 'Solid', electronegativity: '1.63', electronConfig: '[Ar] 3d³ 4s²', density: '6.11' },
        { symbol: 'Cr', name: 'Chromium',    number: 24, category: 'transition-metal',  row: 4, col: 6,  atomicMass: '51.996',    phase: 'Solid', electronegativity: '1.66', electronConfig: '[Ar] 3d⁵ 4s¹', density: '7.15' },
        { symbol: 'Mn', name: 'Manganese',   number: 25, category: 'transition-metal',  row: 4, col: 7,  atomicMass: '54.938',    phase: 'Solid', electronegativity: '1.55', electronConfig: '[Ar] 3d⁵ 4s²', density: '7.44' },
        { symbol: 'Fe', name: 'Iron',        number: 26, category: 'transition-metal',  row: 4, col: 8,  atomicMass: '55.845',    phase: 'Solid', electronegativity: '1.83', electronConfig: '[Ar] 3d⁶ 4s²', density: '7.874' },
        { symbol: 'Co', name: 'Cobalt',      number: 27, category: 'transition-metal',  row: 4, col: 9,  atomicMass: '58.933',    phase: 'Solid', electronegativity: '1.88', electronConfig: '[Ar] 3d⁷ 4s²', density: '8.86' },
        { symbol: 'Ni', name: 'Nickel',      number: 28, category: 'transition-metal',  row: 4, col: 10, atomicMass: '58.693',    phase: 'Solid', electronegativity: '1.91', electronConfig: '[Ar] 3d⁸ 4s²', density: '8.912' },
        { symbol: 'Cu', name: 'Copper',      number: 29, category: 'transition-metal',  row: 4, col: 11, atomicMass: '63.546',    phase: 'Solid', electronegativity: '1.90', electronConfig: '[Ar] 3d¹⁰ 4s¹', density: '8.96' },
        { symbol: 'Zn', name: 'Zinc',        number: 30, category: 'transition-metal',  row: 4, col: 12, atomicMass: '65.38',     phase: 'Solid', electronegativity: '1.65', electronConfig: '[Ar] 3d¹⁰ 4s²', density: '7.134' },
        { symbol: 'Ga', name: 'Gallium',     number: 31, category: 'post-transition',   row: 4, col: 13, atomicMass: '69.723',    phase: 'Solid', electronegativity: '1.81', electronConfig: '[Ar] 3d¹⁰ 4s² 4p¹', density: '5.907' },
        { symbol: 'Ge', name: 'Germanium',   number: 32, category: 'metalloid',         row: 4, col: 14, atomicMass: '72.630',    phase: 'Solid', electronegativity: '2.01', electronConfig: '[Ar] 3d¹⁰ 4s² 4p²', density: '5.323' },
        { symbol: 'As', name: 'Arsenic',     number: 33, category: 'metalloid',         row: 4, col: 15, atomicMass: '74.922',    phase: 'Solid', electronegativity: '2.18', electronConfig: '[Ar] 3d¹⁰ 4s² 4p³', density: '5.776' },
        { symbol: 'Se', name: 'Selenium',    number: 34, category: 'nonmetal',          row: 4, col: 16, atomicMass: '78.971',    phase: 'Solid', electronegativity: '2.55', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁴', density: '4.809' },
        { symbol: 'Br', name: 'Bromine',     number: 35, category: 'halogen',           row: 4, col: 17, atomicMass: '79.904',    phase: 'Liquid',electronegativity: '2.96', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁵', density: '3.122' },
        { symbol: 'Kr', name: 'Krypton',     number: 36, category: 'noble-gas',         row: 4, col: 18, atomicMass: '83.798',    phase: 'Gas',   electronegativity: '3.00', electronConfig: '[Ar] 3d¹⁰ 4s² 4p⁶', density: '0.003733' },

        // Period 5
        { symbol: 'Rb', name: 'Rubidium',    number: 37, category: 'alkali-metal',      row: 5, col: 1,  atomicMass: '85.468',    phase: 'Solid', electronegativity: '0.82', electronConfig: '[Kr] 5s¹', density: '1.532' },
        { symbol: 'Sr', name: 'Strontium',   number: 38, category: 'alkaline-earth',    row: 5, col: 2,  atomicMass: '87.62',     phase: 'Solid', electronegativity: '0.95', electronConfig: '[Kr] 5s²', density: '2.64' },
        { symbol: 'Y',  name: 'Yttrium',     number: 39, category: 'transition-metal',  row: 5, col: 3,  atomicMass: '88.906',    phase: 'Solid', electronegativity: '1.22', electronConfig: '[Kr] 4d¹ 5s²', density: '4.469' },
        { symbol: 'Zr', name: 'Zirconium',   number: 40, category: 'transition-metal',  row: 5, col: 4,  atomicMass: '91.224',    phase: 'Solid', electronegativity: '1.33', electronConfig: '[Kr] 4d² 5s²', density: '6.506' },
        { symbol: 'Nb', name: 'Niobium',     number: 41, category: 'transition-metal',  row: 5, col: 5,  atomicMass: '92.906',    phase: 'Solid', electronegativity: '1.60', electronConfig: '[Kr] 4d⁴ 5s¹', density: '8.57' },
        { symbol: 'Mo', name: 'Molybdenum',  number: 42, category: 'transition-metal',  row: 5, col: 6,  atomicMass: '95.95',     phase: 'Solid', electronegativity: '2.16', electronConfig: '[Kr] 4d⁵ 5s¹', density: '10.22' },
        { symbol: 'Tc', name: 'Technetium',  number: 43, category: 'transition-metal',  row: 5, col: 7,  atomicMass: '[98]',      phase: 'Solid', electronegativity: '1.90', electronConfig: '[Kr] 4d⁵ 5s²', density: '11.5' },
        { symbol: 'Ru', name: 'Ruthenium',   number: 44, category: 'transition-metal',  row: 5, col: 8,  atomicMass: '101.07',    phase: 'Solid', electronegativity: '2.20', electronConfig: '[Kr] 4d⁷ 5s¹', density: '12.37' },
        { symbol: 'Rh', name: 'Rhodium',     number: 45, category: 'transition-metal',  row: 5, col: 9,  atomicMass: '102.91',    phase: 'Solid', electronegativity: '2.28', electronConfig: '[Kr] 4d⁸ 5s¹', density: '12.41' },
        { symbol: 'Pd', name: 'Palladium',   number: 46, category: 'transition-metal',  row: 5, col: 10, atomicMass: '106.42',    phase: 'Solid', electronegativity: '2.20', electronConfig: '[Kr] 4d¹⁰', density: '12.02' },
        { symbol: 'Ag', name: 'Silver',      number: 47, category: 'transition-metal',  row: 5, col: 11, atomicMass: '107.87',    phase: 'Solid', electronegativity: '1.93', electronConfig: '[Kr] 4d¹⁰ 5s¹', density: '10.501' },
        { symbol: 'Cd', name: 'Cadmium',     number: 48, category: 'transition-metal',  row: 5, col: 12, atomicMass: '112.41',    phase: 'Solid', electronegativity: '1.69', electronConfig: '[Kr] 4d¹⁰ 5s²', density: '8.69' },
        { symbol: 'In', name: 'Indium',      number: 49, category: 'post-transition',   row: 5, col: 13, atomicMass: '114.82',    phase: 'Solid', electronegativity: '1.78', electronConfig: '[Kr] 4d¹⁰ 5s² 5p¹', density: '7.31' },
        { symbol: 'Sn', name: 'Tin',         number: 50, category: 'post-transition',   row: 5, col: 14, atomicMass: '118.71',    phase: 'Solid', electronegativity: '1.96', electronConfig: '[Kr] 4d¹⁰ 5s² 5p²', density: '7.287' },
        { symbol: 'Sb', name: 'Antimony',    number: 51, category: 'metalloid',         row: 5, col: 15, atomicMass: '121.76',    phase: 'Solid', electronegativity: '2.05', electronConfig: '[Kr] 4d¹⁰ 5s² 5p³', density: '6.685' },
        { symbol: 'Te', name: 'Tellurium',   number: 52, category: 'metalloid',         row: 5, col: 16, atomicMass: '127.60',    phase: 'Solid', electronegativity: '2.10', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁴', density: '6.232' },
        { symbol: 'I',  name: 'Iodine',      number: 53, category: 'halogen',           row: 5, col: 17, atomicMass: '126.90',    phase: 'Solid', electronegativity: '2.66', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁵', density: '4.93' },
        { symbol: 'Xe', name: 'Xenon',       number: 54, category: 'noble-gas',         row: 5, col: 18, atomicMass: '131.29',    phase: 'Gas',   electronegativity: '2.60', electronConfig: '[Kr] 4d¹⁰ 5s² 5p⁶', density: '0.005887' },

        // Period 6 (Main Table)
        { symbol: 'Cs', name: 'Cesium',      number: 55, category: 'alkali-metal',      row: 6, col: 1,  atomicMass: '132.91',    phase: 'Solid', electronegativity: '0.79', electronConfig: '[Xe] 6s¹', density: '1.873' },
        { symbol: 'Ba', name: 'Barium',      number: 56, category: 'alkaline-earth',    row: 6, col: 2,  atomicMass: '137.33',    phase: 'Solid', electronegativity: '0.89', electronConfig: '[Xe] 6s²', density: '3.594' },
        { symbol: 'La', name: 'Lanthanum',   number: 57, category: 'lanthanide',        row: 6, col: 3,  atomicMass: '138.91',    phase: 'Solid', electronegativity: '1.10', electronConfig: '[Xe] 5d¹ 6s²', density: '6.145' },
        { symbol: 'Hf', name: 'Hafnium',     number: 72, category: 'transition-metal',  row: 6, col: 4,  atomicMass: '178.49',    phase: 'Solid', electronegativity: '1.30', electronConfig: '[Xe] 4f¹⁴ 5d² 6s²', density: '13.31' },
        { symbol: 'Ta', name: 'Tantalum',    number: 73, category: 'transition-metal',  row: 6, col: 5,  atomicMass: '180.95',    phase: 'Solid', electronegativity: '1.50', electronConfig: '[Xe] 4f¹⁴ 5d³ 6s²', density: '16.654' },
        { symbol: 'W',  name: 'Tungsten',    number: 74, category: 'transition-metal',  row: 6, col: 6,  atomicMass: '183.84',    phase: 'Solid', electronegativity: '2.36', electronConfig: '[Xe] 4f¹⁴ 5d⁴ 6s²', density: '19.25' },
        { symbol: 'Re', name: 'Rhenium',     number: 75, category: 'transition-metal',  row: 6, col: 7,  atomicMass: '186.21',    phase: 'Solid', electronegativity: '1.90', electronConfig: '[Xe] 4f¹⁴ 5d⁵ 6s²', density: '21.02' },
        { symbol: 'Os', name: 'Osmium',      number: 76, category: 'transition-metal',  row: 6, col: 8,  atomicMass: '190.23',    phase: 'Solid', electronegativity: '2.20', electronConfig: '[Xe] 4f¹⁴ 5d⁶ 6s²', density: '22.61' },
        { symbol: 'Ir', name: 'Iridium',     number: 77, category: 'transition-metal',  row: 6, col: 9,  atomicMass: '192.22',    phase: 'Solid', electronegativity: '2.20', electronConfig: '[Xe] 4f¹⁴ 5d⁷ 6s²', density: '22.56' },
        { symbol: 'Pt', name: 'Platinum',    number: 78, category: 'transition-metal',  row: 6, col: 10, atomicMass: '195.08',    phase: 'Solid', electronegativity: '2.28', electronConfig: '[Xe] 4f¹⁴ 5d⁹ 6s¹', density: '21.46' },
        { symbol: 'Au', name: 'Gold',        number: 79, category: 'transition-metal',  row: 6, col: 11, atomicMass: '196.97',    phase: 'Solid', electronegativity: '2.54', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', density: '19.282' },
        { symbol: 'Hg', name: 'Mercury',     number: 80, category: 'transition-metal',  row: 6, col: 12, atomicMass: '200.59',    phase: 'Liquid',electronegativity: '2.00', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', density: '13.5336' },
        { symbol: 'Tl', name: 'Thallium',    number: 81, category: 'post-transition',   row: 6, col: 13, atomicMass: '204.38',    phase: 'Solid', electronegativity: '1.62', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹', density: '11.85' },
        { symbol: 'Pb', name: 'Lead',        number: 82, category: 'post-transition',   row: 6, col: 14, atomicMass: '207.2',     phase: 'Solid', electronegativity: '2.33', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', density: '11.342' },
        { symbol: 'Bi', name: 'Bismuth',     number: 83, category: 'post-transition',   row: 6, col: 15, atomicMass: '208.98',    phase: 'Solid', electronegativity: '2.02', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³', density: '9.807' },
        { symbol: 'Po', name: 'Polonium',    number: 84, category: 'metalloid',         row: 6, col: 16, atomicMass: '[209]',     phase: 'Solid', electronegativity: '2.00', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴', density: '9.32' },
        { symbol: 'At', name: 'Astatine',    number: 85, category: 'halogen',           row: 6, col: 17, atomicMass: '[210]',     phase: 'Solid', electronegativity: '2.20', electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵', density: '7' },
        { symbol: 'Rn', name: 'Radon',       number: 86, category: 'noble-gas',         row: 6, col: 18, atomicMass: '[222]',     phase: 'Gas',   electronegativity: 'N/A',  electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶', density: '0.00973' },

        // Period 7 (Main Table)
        { symbol: 'Fr', name: 'Francium',    number: 87, category: 'alkali-metal',      row: 7, col: 1,  atomicMass: '[223]',     phase: 'Solid', electronegativity: '0.70', electronConfig: '[Rn] 7s¹', density: '1.87' },
        { symbol: 'Ra', name: 'Radium',      number: 88, category: 'alkaline-earth',    row: 7, col: 2,  atomicMass: '[226]',     phase: 'Solid', electronegativity: '0.89', electronConfig: '[Rn] 7s²', density: '5.5' },
        { symbol: 'Ac', name: 'Actinium',    number: 89, category: 'actinide',          row: 7, col: 3,  atomicMass: '[227]',     phase: 'Solid', electronegativity: '1.10', electronConfig: '[Rn] 6d¹ 7s²', density: '10.07' },
        { symbol: 'Rf', name: 'Rutherfordium',number:104,category:'transition-metal',   row: 7, col: 4,  atomicMass: '[267]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d² 7s²', density: '23.2' },
        { symbol: 'Db', name: 'Dubnium',     number:105, category:'transition-metal',   row: 7, col: 5,  atomicMass: '[268]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d³ 7s²', density: '29.3' },
        { symbol: 'Sg', name: 'Seaborgium',  number:106, category:'transition-metal',   row: 7, col: 6,  atomicMass: '[269]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d⁴ 7s²', density: '35.0' },
        { symbol: 'Bh', name: 'Bohrium',     number:107, category:'transition-metal',   row: 7, col: 7,  atomicMass: '[270]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d⁵ 7s²', density: '37.1' },
        { symbol: 'Hs', name: 'Hassium',     number:108, category:'transition-metal',   row: 7, col: 8,  atomicMass: '[269]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d⁶ 7s²', density: '40.7' },
        { symbol: 'Mt', name: 'Meitnerium',  number:109, category:'unknown',            row: 7, col: 9,  atomicMass: '[278]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d⁷ 7s²', density: '37.4' },
        { symbol: 'Ds', name: 'Darmstadtium',number:110, category:'unknown',            row: 7, col:10,  atomicMass: '[281]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d⁸ 7s²', density: '34.8' },
        { symbol: 'Rg', name: 'Roentgenium', number:111, category:'unknown',            row: 7, col:11,  atomicMass: '[282]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s¹', density: '28.7' },
        { symbol: 'Cn', name: 'Copernicium', number:112, category:'transition-metal',   row: 7, col:12,  atomicMass: '[285]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s²', density: '23.7' },
        { symbol: 'Nh', name: 'Nihonium',    number:113, category:'unknown',            row: 7, col:13,  atomicMass: '[286]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹', density: '16' },
        { symbol: 'Fl', name: 'Flerovium',   number:114, category:'unknown',            row: 7, col:14,  atomicMass: '[289]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²', density: '14' },
        { symbol: 'Mc', name: 'Moscovium',   number:115, category:'unknown',            row: 7, col:15,  atomicMass: '[290]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³', density: '13.5' },
        { symbol: 'Lv', name: 'Livermorium', number:116, category:'unknown',            row: 7, col:16,  atomicMass: '[293]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴', density: '12.9' },
        { symbol: 'Ts', name: 'Tennessine',  number:117, category:'halogen',            row: 7, col:17,  atomicMass: '[294]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵', density: '7.2' },
        { symbol: 'Og', name: 'Oganesson',   number:118, category:'unknown',            row: 7, col:18,  atomicMass: '[294]',     phase: 'Unknown',electronegativity:'N/A', electronConfig: '[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶', density: '5.0' },

        // Lanthanides (Row 8)
        { symbol: 'Ce', name: 'Cerium',      number: 58, category: 'lanthanide',        row: 8, col: 4,  atomicMass: '140.12',    phase: 'Solid', electronegativity: '1.12', electronConfig: '[Xe] 4f¹ 5d¹ 6s²', density: '6.770' },
        { symbol: 'Pr', name: 'Praseodymium',number: 59, category: 'lanthanide',        row: 8, col: 5,  atomicMass: '140.91',    phase: 'Solid', electronegativity: '1.13', electronConfig: '[Xe] 4f³ 6s²', density: '6.773' },
        { symbol: 'Nd', name: 'Neodymium',   number: 60, category: 'lanthanide',        row: 8, col: 6,  atomicMass: '144.24',    phase: 'Solid', electronegativity: '1.14', electronConfig: '[Xe] 4f⁴ 6s²', density: '7.007' },
        { symbol: 'Pm', name: 'Promethium',  number: 61, category: 'lanthanide',        row: 8, col: 7,  atomicMass: '[145]',     phase: 'Solid', electronegativity: '1.13', electronConfig: '[Xe] 4f⁵ 6s²', density: '7.26' },
        { symbol: 'Sm', name: 'Samarium',    number: 62, category: 'lanthanide',        row: 8, col: 8,  atomicMass: '150.36',    phase: 'Solid', electronegativity: '1.17', electronConfig: '[Xe] 4f⁶ 6s²', density: '7.52' },
        { symbol: 'Eu', name: 'Europium',    number: 63, category: 'lanthanide',        row: 8, col: 9,  atomicMass: '151.96',    phase: 'Solid', electronegativity: '1.20', electronConfig: '[Xe] 4f⁷ 6s²', density: '5.243' },
        { symbol: 'Gd', name: 'Gadolinium',  number: 64, category: 'lanthanide',        row: 8, col: 10, atomicMass: '157.25',    phase: 'Solid', electronegativity: '1.20', electronConfig: '[Xe] 4f⁷ 5d¹ 6s²', density: '7.895' },
        { symbol: 'Tb', name: 'Terbium',     number: 65, category: 'lanthanide',        row: 8, col: 11, atomicMass: '158.93',    phase: 'Solid', electronegativity: '1.20', electronConfig: '[Xe] 4f⁹ 6s²', density: '8.229' },
        { symbol: 'Dy', name: 'Dysprosium',  number: 66, category: 'lanthanide',        row: 8, col: 12, atomicMass: '162.50',    phase: 'Solid', electronegativity: '1.22', electronConfig: '[Xe] 4f¹⁰ 6s²', density: '8.55' },
        { symbol: 'Ho', name: 'Holmium',     number: 67, category: 'lanthanide',        row: 8, col: 13, atomicMass: '164.93',    phase: 'Solid', electronegativity: '1.23', electronConfig: '[Xe] 4f¹¹ 6s²', density: '8.795' },
        { symbol: 'Er', name: 'Erbium',      number: 68, category: 'lanthanide',        row: 8, col: 14, atomicMass: '167.26',    phase: 'Solid', electronegativity: '1.24', electronConfig: '[Xe] 4f¹² 6s²', density: '9.066' },
        { symbol: 'Tm', name: 'Thulium',     number: 69, category: 'lanthanide',        row: 8, col: 15, atomicMass: '168.93',    phase: 'Solid', electronegativity: '1.25', electronConfig: '[Xe] 4f¹³ 6s²', density: '9.321' },
        { symbol: 'Yb', name: 'Ytterbium',   number: 70, category: 'lanthanide',        row: 8, col: 16, atomicMass: '173.05',    phase: 'Solid', electronegativity: '1.10', electronConfig: '[Xe] 4f¹⁴ 6s²', density: '6.965' },
        { symbol: 'Lu', name: 'Lutetium',    number: 71, category: 'lanthanide',        row: 8, col: 17, atomicMass: '174.97',    phase: 'Solid', electronegativity: '1.27', electronConfig: '[Xe] 4f¹⁴ 5d¹ 6s²', density: '9.84' },

        // Actinides (Row 9)
        { symbol: 'Th', name: 'Thorium',     number: 90, category: 'actinide',          row: 9, col: 4,  atomicMass: '232.04',    phase: 'Solid', electronegativity: '1.30', electronConfig: '[Rn] 6d² 7s²', density: '11.72' },
        { symbol: 'Pa', name: 'Protactinium',number: 91, category: 'actinide',          row: 9, col: 5,  atomicMass: '231.04',    phase: 'Solid', electronegativity: '1.50', electronConfig: '[Rn] 5f² 6d¹ 7s²', density: '15.37' },
        { symbol: 'U',  name: 'Uranium',     number: 92, category: 'actinide',          row: 9, col: 6,  atomicMass: '238.03',    phase: 'Solid', electronegativity: '1.38', electronConfig: '[Rn] 5f³ 6d¹ 7s²', density: '18.95' },
        { symbol: 'Np', name: 'Neptunium',   number: 93, category: 'actinide',          row: 9, col: 7,  atomicMass: '[237]',     phase: 'Solid', electronegativity: '1.36', electronConfig: '[Rn] 5f⁴ 6d¹ 7s²', density: '20.45' },
        { symbol: 'Pu', name: 'Plutonium',   number: 94, category: 'actinide',          row: 9, col: 8,  atomicMass: '[244]',     phase: 'Solid', electronegativity: '1.28', electronConfig: '[Rn] 5f⁶ 7s²', density: '19.84' },
        { symbol: 'Am', name: 'Americium',   number: 95, category: 'actinide',          row: 9, col: 9,  atomicMass: '[243]',     phase: 'Solid', electronegativity: '1.30', electronConfig: '[Rn] 5f⁷ 7s²', density: '13.69' },
        { symbol: 'Cm', name: 'Curium',      number: 96, category: 'actinide',          row: 9, col: 10, atomicMass: '[247]',     phase: 'Solid', electronegativity: '1.30', electronConfig: '[Rn] 5f⁷ 6d¹ 7s²', density: '13.51' },
        { symbol: 'Bk', name: 'Berkelium',   number: 97, category: 'actinide',          row: 9, col: 11, atomicMass: '[247]',     phase: 'Solid', electronegativity: '1.30', electronConfig: '[Rn] 5f⁹ 7s²', density: '14.78' },
        { symbol: 'Cf', name: 'Californium', number: 98, category: 'actinide',          row: 9, col: 12, atomicMass: '[251]',     phase: 'Solid', electronegativity: '1.30', electronConfig: '[Rn] 5f¹⁰ 7s²', density: '15.1' },
        { symbol: 'Es', name: 'Einsteinium', number: 99, category: 'actinide',          row: 9, col: 13, atomicMass: '[252]',     phase: 'Solid', electronegativity: '1.30', electronConfig: '[Rn] 5f¹¹ 7s²', density: '8.84' },
        { symbol: 'Fm', name: 'Fermium',     number:100, category: 'actinide',          row: 9, col: 14, atomicMass: '[257]',     phase: 'Solid', electronegativity: '1.30', electronConfig: '[Rn] 5f¹² 7s²', density: '9.7' },
        { symbol: 'Md', name: 'Mendelevium', number:101, category: 'actinide',          row: 9, col: 15, atomicMass: '[258]',     phase: 'Solid', electronegativity: '1.30', electronConfig: '[Rn] 5f¹³ 7s²', density: '10.3' },
        { symbol: 'No', name: 'Nobelium',    number:102, category: 'actinide',          row: 9, col: 16, atomicMass: '[259]',     phase: 'Solid', electronegativity: '1.30', electronConfig: '[Rn] 5f¹⁴ 7s²', density: '9.9' },
        { symbol: 'Lr', name: 'Lawrencium',  number:103, category: 'actinide',          row: 9, col: 17, atomicMass: '[266]',     phase: 'Solid', electronegativity: '1.30', electronConfig: '[Rn] 5f¹⁴ 6d¹ 7s²', density: '15.6' }
    ];

    // Initialize the application
    init();

    function init() {
        createPeriodicTable();
        setupEventListeners();
        createChemistryAnimations();
    }

    // Create periodic table elements
    function createPeriodicTable() {
        periodicTable.innerHTML = '';
        
        elements.forEach(element => {
            const el = document.createElement('div');
            el.classList.add('element');
            el.classList.add(element.category);
            el.setAttribute('role', 'gridcell');
            el.setAttribute('aria-label', `${element.name}, ${element.symbol}, atomic number ${element.number}`);
            el.tabIndex = 0;
           
            if (element.row && element.col) {
                el.style.gridRow = element.row;
                el.style.gridColumn = element.col;
            }
           
            el.innerHTML = `
                <div class="number">${element.number}</div>
                <div class="symbol">${element.symbol}</div>
            `;
           
            el.addEventListener('click', () => {
                showElementModal(element);
            });
            
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    showElementModal(element);
                }
            });
           
            periodicTable.appendChild(el);
        });
    }

    // Show element modal with details
    function showElementModal(element) {
        currentElement = element;
        
        document.getElementById('modalSymbol').textContent = element.symbol;
        document.getElementById('modalName').textContent = element.name;
        document.getElementById('modalNumber').textContent = `Atomic Number: ${element.number}`;
       
        const modalSymbol = document.getElementById('modalSymbol');
        modalSymbol.style.color = `var(--${element.category})`;
       
        // Update modal content
        document.getElementById('atomicMass').textContent = `${element.atomicMass} u`;
        document.getElementById('category').textContent = formatCategory(element.category);
        document.getElementById('phase').textContent = element.phase;
        document.getElementById('density').textContent = `${element.density} g/cm³`;
        document.getElementById('meltingPoint').textContent = element.meltingPoint || 'Unknown';
        document.getElementById('boilingPoint').textContent = element.boilingPoint || 'Unknown';
        document.getElementById('electronegativity').textContent = element.electronegativity;
        document.getElementById('electronConfig').textContent = element.electronConfig;
       
        // Update element image
        const elementImage = document.getElementById('elementImage');
        elementImage.innerHTML = '';
       
        const img = document.createElement('img');
        img.src = `https://images-of-elements.com/${element.name.toLowerCase()}.jpg`;
        img.alt = `Visual representation of ${element.name}`;
        img.onerror = function() {
            elementImage.innerHTML = `<i class="fas fa-atom" style="font-size: 3rem; color: var(--${element.category});" aria-hidden="true"></i>`;
        };
        elementImage.appendChild(img);
       
        // Show modal
        elementModal.setAttribute('aria-hidden', 'false');
        elementModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on close button for accessibility
        setTimeout(() => {
            closeModal.focus();
        }, 100);
    }

    // Format category for display
    function formatCategory(category) {
        return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Close modal
    function closeElementModal() {
        elementModal.setAttribute('aria-hidden', 'true');
        elementModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Return focus to the element that was clicked
        if (currentElement) {
            const elementCell = document.querySelector(`.element[aria-label*="${currentElement.name}"]`);
            if (elementCell) {
                elementCell.focus();
            }
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Close modal
        closeModal.addEventListener('click', closeElementModal);
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elementModal.classList.contains('active')) {
                closeElementModal();
            }
        });
        
        // Close modal when clicking outside
        elementModal.addEventListener('click', (e) => {
            if (e.target === elementModal) {
                closeElementModal();
            }
        });

        // Rotate table controls
        rotateLeftBtn.addEventListener('click', () => {
            currentRotation -= 15;
            tableContainer.style.transform = `rotateY(${currentRotation}deg)`;
        });
       
        rotateRightBtn.addEventListener('click', () => {
            currentRotation += 15;
            tableContainer.style.transform = `rotateY(${currentRotation}deg)`;
        });
       
        resetViewBtn.addEventListener('click', () => {
            currentRotation = 0;
            tableContainer.style.transform = `rotateY(${currentRotation}deg)`;
        });
       
        // Back to top button functionality
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
       
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
       
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
               
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
               
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Create chemistry animations in background
    function createChemistryAnimations() {
        // Create atoms
        for (let i = 0; i < 5; i++) {
            createAtom(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight,
                Math.random() * 30 + 20
            );
        }
        
        // Create molecules
        for (let i = 0; i < 3; i++) {
            createMolecule(
                Math.random() * window.innerWidth,
                Math.random() * window.innerHeight
            );
        }
        
        // Create bubbles
        for (let i = 0; i < 10; i++) {
            createBubble(
                Math.random() * window.innerWidth,
                window.innerHeight + 50
            );
        }
    }
    
    function createAtom(x, y, size) {
        const atom = document.createElement('div');
        atom.classList.add('atom');
        atom.style.left = `${x}px`;
        atom.style.top = `${y}px`;
        
        const nucleus = document.createElement('div');
        nucleus.classList.add('nucleus');
        nucleus.style.width = `${size / 3}px`;
        nucleus.style.height = `${size / 3}px`;
        nucleus.style.top = `${size / 3}px`;
        nucleus.style.left = `${size / 3}px`;
        
        const shell = document.createElement('div');
        shell.classList.add('electron-shell');
        shell.style.width = `${size}px`;
        shell.style.height = `${size}px`;
        
        const electron = document.createElement('div');
        electron.classList.add('electron');
        electron.style.top = '0px';
        electron.style.left = `${size / 2 - 3}px`;
        
        shell.appendChild(electron);
        atom.appendChild(nucleus);
        atom.appendChild(shell);
        chemistryAnimations.appendChild(atom);
    }
    
    function createMolecule(x, y) {
        const molecule = document.createElement('div');
        molecule.classList.add('molecule');
        molecule.style.left = `${x}px`;
        molecule.style.top = `${y}px`;
        
        const atom1 = document.createElement('div');
        atom1.classList.add('atom-in-molecule');
        atom1.style.width = '20px';
        atom1.style.height = '20px';
        atom1.style.backgroundColor = 'rgba(110, 0, 255, 0.7)';
        atom1.style.top = '0px';
        atom1.style.left = '0px';
        
        const atom2 = document.createElement('div');
        atom2.classList.add('atom-in-molecule');
        atom2.style.width = '20px';
        atom2.style.height = '20px';
        atom2.style.backgroundColor = 'rgba(0, 255, 170, 0.7)';
        atom2.style.top = '30px';
        atom2.style.left = '30px';
        
        const bond = document.createElement('div');
        bond.classList.add('bond');
        bond.style.width = '42px';
        bond.style.height = '2px';
        bond.style.top = '19px';
        bond.style.left = '9px';
        bond.style.transform = 'rotate(45deg)';
        
        molecule.appendChild(atom1);
        molecule.appendChild(atom2);
        molecule.appendChild(bond);
        chemistryAnimations.appendChild(molecule);
    }
    
    function createBubble(x, y) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        bubble.style.width = `${Math.random() * 20 + 10}px`;
        bubble.style.height = bubble.style.width;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        
        chemistryAnimations.appendChild(bubble);
    }
});
