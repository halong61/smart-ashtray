import 'package:flutter/material.dart';
import 'core/constants.dart';

void main() {
  runApp(const SmartAshtrayApp());
}

class SmartAshtrayApp extends StatelessWidget {
  const SmartAshtrayApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Ashtray',
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: AppColors.background,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.accent,
          secondary: AppColors.accent,
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: AppColors.background,
          elevation: 0,
        ),
        cardTheme: const CardThemeData(
          color: AppColors.card,
          margin: EdgeInsets.zero,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.all(Radius.circular(20)),
          ),
        ),
      ),
      home: const BoothControlPage(),
    );
  }
}

class BoothControlPage extends StatefulWidget {
  const BoothControlPage({super.key});

  @override
  State<BoothControlPage> createState() => _BoothControlPageState();
}

class _BoothControlPageState extends State<BoothControlPage> {
  final List<BoothItem> booths = [
    BoothItem(name: '휴게실', location: '2F · 휴게실 중앙', status: '주의', water: 34, autoMode: true, lastSpray: '12:40'),
    BoothItem(name: '출입구', location: '1F · 정문 입구', status: '정상', water: 72, autoMode: false, lastSpray: '09:12'),
    BoothItem(name: '회의실', location: '3F · 회의실 복도', status: '위험', water: 21, autoMode: true, lastSpray: '13:05'),
  ];

  @override
  Widget build(BuildContext context) {
    final averageWater = booths.fold<int>(0, (sum, booth) => sum + booth.water) ~/ booths.length;
    final activeAlert = booths.where((booth) => booth.status != '정상').length;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '스마트 애쉬트레이',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: AppColors.textPrimary,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '실시간 재떨이 관리',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: AppColors.textSecond,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.card,
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: AppColors.borderBase),
                  ),
                  child: const Text('ONLINE', style: TextStyle(color: AppColors.stateIdle, fontWeight: FontWeight.w700)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                gradient: const LinearGradient(
                  colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                border: Border.all(color: AppColors.borderBase),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.water_drop_outlined, color: AppColors.accent),
                      const SizedBox(width: 8),
                      Text('원격 살수 제어', style: Theme.of(context).textTheme.titleMedium?.copyWith(color: AppColors.textPrimary, fontWeight: FontWeight.w700)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text('자동 모드와 수동 분사 모두 운영자가 바로 제어할 수 있는 UI입니다.', style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.textSecond)),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      _metricChip('수위', '$averageWater%'),
                      _metricChip('경고', '$activeAlert개'),
                      _metricChip('모드', 'AUTO'),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            GridView.count(
              shrinkWrap: true,
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.5,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildStatCard('Water', '${averageWater}%', AppColors.accent),
                _buildStatCard('Alert', '$activeAlert', AppColors.stateWarning),
              ],
            ),
            const SizedBox(height: 16),
            ...booths.map((booth) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _buildBoothCard(booth),
            )),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        icon: const Icon(Icons.add),
        label: const Text('부스 추가'),
        backgroundColor: AppColors.accent,
      ),
    );
  }

  Widget _buildStatCard(String title, String value, Color accentColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.borderBase),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(color: AppColors.textSecond, fontSize: 12)),
          const SizedBox(height: 8),
          Text(value, style: TextStyle(color: accentColor, fontSize: 24, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }

  Widget _buildBoothCard(BoothItem booth) {
    final isLowWater = booth.water < 25;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppColors.borderBase),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(booth.name, style: const TextStyle(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 2),
                    Text(booth.location, style: const TextStyle(color: AppColors.textSecond, fontSize: 12)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: isLowWater ? const Color(0xFF2D1B1B) : const Color(0xFF162A2D),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  isLowWater ? 'Water Low' : 'Water OK',
                  style: TextStyle(color: isLowWater ? AppColors.stateFire : AppColors.stateIdle, fontSize: 11, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              minHeight: 8,
              value: booth.water / 100,
              backgroundColor: const Color(0xFF2A2D3A),
              valueColor: AlwaysStoppedAnimation<Color>(isLowWater ? AppColors.stateFire : AppColors.accent),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Text('수위 ${booth.water}%', style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w600)),
              const Spacer(),
              Text('최근 분사 ${booth.lastSpray}', style: const TextStyle(color: AppColors.textSecond, fontSize: 12)),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.shower_outlined, size: 18),
                  label: const Text('수동 분사'),
                  style: OutlinedButton.styleFrom(side: const BorderSide(color: AppColors.borderBase), foregroundColor: AppColors.textPrimary),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(backgroundColor: booth.autoMode ? AppColors.accent : AppColors.card, foregroundColor: booth.autoMode ? Colors.black : AppColors.textPrimary),
                  child: Text(booth.autoMode ? '자동모드 ON' : '자동모드 OFF'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _metricChip(String title, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('$title: ', style: const TextStyle(color: AppColors.textSecond, fontSize: 12)),
          Text(value, style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w700, fontSize: 12)),
        ],
      ),
    );
  }
}

class BoothItem {
  BoothItem({required this.name, required this.location, required this.status, required this.water, required this.autoMode, required this.lastSpray});

  final String name;
  final String location;
  final String status;
  final int water;
  final bool autoMode;
  final String lastSpray;
}
