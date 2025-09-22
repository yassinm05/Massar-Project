import 'package:flutter/material.dart';

void main() {
  runApp(const MassarApp());
}

class MassarApp extends StatelessWidget {
  const MassarApp({super.key});

  @override
  Widget build(BuildContext context) {

    return const MaterialApp(
      title: 'Massar App',
      debugShowCheckedModeBanner: false,

      home:  Scaffold(),
    );
  }
}
