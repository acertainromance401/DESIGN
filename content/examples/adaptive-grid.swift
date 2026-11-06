import SwiftUI

struct AdaptiveGridExample: View {
    @Environment(\.dynamicTypeSize) private var typeSize
    private let items = ["Overview", "Recent activity", "Saved items", "Account"]

    var body: some View {
        ScrollView {
            LazyVGrid(columns: typeSize.isAccessibilitySize
                ? [GridItem(.flexible())]
                : [GridItem(.adaptive(minimum: 220))], spacing: 16) {
                ForEach(items, id: \.self) { item in
                    VStack(alignment: .leading, spacing: 8) {
                        Text(item).font(.headline)
                        Text("A summary that may wrap to more than one line.")
                            .fixedSize(horizontal: false, vertical: true)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding()
                    .background(.quaternary, in: RoundedRectangle(cornerRadius: 12))
                }
            }
            .padding()
        }
    }
}
