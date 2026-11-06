import SwiftUI

struct ComparisonBarsExample: View {
    private let values = [("Alpha", 30.0), ("Beta", 60.0), ("Gamma", 45.0)]

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("Sample values").font(.title2).accessibilityAddTraits(.isHeader)
            Text("Illustrative positive values. Unit: points. Scale: 0 to 60.")
            ForEach(values, id: \.0) { item in
                VStack(alignment: .leading, spacing: 6) {
                    Text("\(item.0): \(item.1.formatted()) points")
                    GeometryReader { geometry in
                        Rectangle()
                            .fill(.blue)
                            .frame(width: geometry.size.width * item.1 / 60)
                    }
                    .frame(height: 16)
                    .accessibilityHidden(true)
                }
            }
        }
        .padding()
    }
}
