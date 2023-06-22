<script lang="ts">
    import { Bar } from 'svelte-chartjs';

    import {
        Chart,
        Title,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale,
		type ChartData,
    } from 'chart.js';
	import { testTheme } from '../../stores/theme';

    Chart.register(
        Title,
        Tooltip,
        Legend,
        BarElement,
        CategoryScale,
        LinearScale
    );

    const data = {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [
            {
                label: 'Attempted logins',
                data: [12, 19, 3, 5, 2, 3, 10],
                backgroundColor: [
                    'rgba(255, 134,159,0.4)',
                    'rgba(98,  182, 239,0.4)',
                    'rgba(255, 218, 128,0.4)',
                    'rgba(113, 205, 205,0.4)',
                    'rgba(170, 128, 252,0.4)',
                    'rgba(255, 177, 101,0.4)',
                    'rgba(255, 177, 101,0.4)',
                ],
                borderWidth: 2,
                borderColor: [
                    'rgba(255, 134, 159, 1)',
                    'rgba(98,  182, 239, 1)',
                    'rgba(255, 218, 128, 1)',
                    'rgba(113, 205, 205, 1)',
                    'rgba(170, 128, 252, 1)',
                    'rgba(255, 177, 101, 1)',
                    'rgba(255, 177, 101, 1)',
                ],
            },
        ],
    };

</script>
  
<Bar {data} options={{ responsive: true, color: $testTheme==="light" ? "#000000" : "#ffffff" }} />