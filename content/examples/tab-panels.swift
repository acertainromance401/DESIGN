import SwiftUI

struct TabPanelsExample: View {
    private enum Panel: String, CaseIterable, Identifiable {
        case overview = "Overview"
        case details = "Details"
        var id: String { rawValue }
    }
    @State private var selection = Panel.overview

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Picker("Information view", selection: $selection) {
                ForEach(Panel.allCases) { panel in
                    Text(panel.rawValue).tag(panel)
                }
            }
            .pickerStyle(.segmented)
            Text(selection == .overview ? "A brief overview." : "Detailed specifications.")
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding()
    }
}
